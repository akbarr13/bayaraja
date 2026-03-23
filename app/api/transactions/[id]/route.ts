import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { transactionStatusSchema } from '@/lib/validations'
import { fireWebhooks } from '@/lib/webhook'
import { checkUserRateLimit } from '@/lib/rate-limit'
import { LIMITS } from '@/lib/constants'
import { ApiError } from '@/lib/api-errors'

async function getSupabaseWithUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed = await checkUserRateLimit(user.id, 'transaction-update', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds)
  if (!allowed) return ApiError.tooManyRequests()

  try {
    const body = await req.json()
    const parsed = transactionStatusSchema.parse(body)

    // Fetch current transaction to validate state transition
    const { data: current, error: fetchErr } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Block same-status updates
    if (current.status === parsed.status) {
      return NextResponse.json(
        { error: `Transaksi sudah berstatus ${parsed.status}.` },
        { status: 409 }
      )
    }

    // Block confirmed → rejected (final state)
    if (current.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Transaksi yang sudah dikonfirmasi tidak bisa diubah.' },
        { status: 409 }
      )
    }

    // Block rejected → confirmed (final state)
    if (current.status === 'rejected') {
      return NextResponse.json(
        { error: 'Transaksi yang sudah ditolak tidak bisa diubah.' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: parsed.status,
        notes: parsed.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // If confirmed and link is single-use, deactivate the link
    if (parsed.status === 'confirmed' && data.payment_link_id) {
      const { data: link } = await supabase
        .from('payment_links')
        .select('is_single_use')
        .eq('id', data.payment_link_id)
        .single()

      if (link?.is_single_use) {
        await supabase
          .from('payment_links')
          .update({ is_active: false })
          .eq('id', data.payment_link_id)
      }
    }

    // Fire webhook async
    if (parsed.status === 'confirmed' || parsed.status === 'rejected') {
      const eventName = parsed.status === 'confirmed'
        ? 'transaction.confirmed' as const
        : 'transaction.rejected' as const
      fireWebhooks(user.id, eventName, {
        transaction_id: id,
        payment_link_id: data.payment_link_id,
        status: parsed.status,
        notes: parsed.notes ?? null,
      })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

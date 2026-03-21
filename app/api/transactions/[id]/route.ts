import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { transactionStatusSchema } from '@/lib/validations'

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

  try {
    const body = await req.json()
    const parsed = transactionStatusSchema.parse(body)

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
    if (parsed.status === 'confirmed') {
      const { data: tx } = await supabase
        .from('transactions')
        .select('payment_link_id')
        .eq('id', id)
        .single()

      if (tx) {
        const { data: link } = await supabase
          .from('payment_links')
          .select('is_single_use')
          .eq('id', tx.payment_link_id)
          .single()

        if (link?.is_single_use) {
          await supabase
            .from('payment_links')
            .update({ is_active: false })
            .eq('id', tx.payment_link_id)
        }
      }
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

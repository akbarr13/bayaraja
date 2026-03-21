import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { paymentLinkSchema } from '@/lib/validations'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

async function getSupabaseWithUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
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

async function resolveUser(req: NextRequest): Promise<{ userId: string } | null> {
  // Try API key first
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const sb = createServerSupabase()
    const keyHash = crypto.createHash('sha256').update(authHeader.slice(7)).digest('hex')
    const { data } = await sb.from('api_keys').select('id, user_id, is_active').eq('key_hash', keyHash).single()
    if (!data?.is_active) return null
    await sb.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id)
    return { userId: data.user_id }
  }

  // Fall back to session
  const { user } = await getSupabaseWithUser()
  if (!user) return null
  return { userId: user.id }
}

export async function GET(req: NextRequest) {
  const resolved = await resolveUser(req)
  if (!resolved) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServerSupabase()
  const { data, error } = await sb
    .from('payment_links')
    .select('*, qris_account:qris_accounts(label, merchant_name)')
    .eq('user_id', resolved.userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const resolved = await resolveUser(req)
  if (!resolved) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServerSupabase()

  try {
    const body = await req.json()
    const parsed = paymentLinkSchema.parse(body)

    // Verify QRIS account belongs to user
    const { data: qris } = await sb
      .from('qris_accounts')
      .select('id')
      .eq('id', parsed.qris_account_id)
      .eq('user_id', resolved.userId)
      .single()

    if (!qris) {
      return NextResponse.json({ error: 'QRIS account tidak ditemukan' }, { status: 400 })
    }

    const slug = nanoid(16)
    const { data, error } = await sb
      .from('payment_links')
      .insert({ ...parsed, user_id: resolved.userId, slug })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      data: {
        ...data,
        payment_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/pay/${slug}`,
      },
    }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'issues' in err) {
      return NextResponse.json({ error: 'Validasi gagal', details: err }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

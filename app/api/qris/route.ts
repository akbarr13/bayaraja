import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { qrisAccountSchema } from '@/lib/validations'
import { checkUserRateLimit } from '@/lib/rate-limit'
import { LIMITS } from '@/lib/constants'

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

export async function GET() {
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('qris_accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed = await checkUserRateLimit(
    user.id, 'qris', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds
  )
  if (!allowed) {
    return NextResponse.json({ error: 'Terlalu banyak request.' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  const { count: qrisCount } = await supabase
    .from('qris_accounts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if ((qrisCount ?? 0) >= LIMITS.maxQrisAccounts) {
    return NextResponse.json(
      { error: `Maksimal ${LIMITS.maxQrisAccounts} QRIS account per akun.` },
      { status: 400 }
    )
  }

  try {
    const body = await req.json()
    const parsed = qrisAccountSchema.parse(body)

    // Unset other defaults server-side (clean, no extra client requests)
    if (parsed.is_default) {
      await supabase
        .from('qris_accounts')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data, error } = await supabase
      .from('qris_accounts')
      .insert({ ...parsed, user_id: user.id })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'issues' in err) {
      return NextResponse.json({ error: 'Validasi gagal', details: err }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

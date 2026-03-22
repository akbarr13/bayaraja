import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
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
  return { user }
}

async function resolveUser(req: NextRequest): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const sb = createServerSupabase()
    const keyHash = crypto.createHash('sha256').update(authHeader.slice(7)).digest('hex')
    const { data } = await sb.from('api_keys').select('id, user_id, is_active').eq('key_hash', keyHash).single()
    if (!data?.is_active) return null
    await sb.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id)
    return { userId: data.user_id }
  }
  const { user } = await getSupabaseWithUser()
  if (!user) return null
  return { userId: user.id }
}

export async function GET(req: NextRequest) {
  const resolved = await resolveUser(req)
  if (!resolved) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page = Math.max(0, parseInt(searchParams.get('page') ?? '0'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const linkId = searchParams.get('link_id')

  const sb = createServerSupabase()
  let query = sb
    .from('transactions')
    .select('*, payment_link:payment_links(title, slug)', { count: 'exact' })
    .eq('user_id', resolved.userId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (status && ['pending', 'confirmed', 'rejected'].includes(status)) {
    query = query.eq('status', status)
  }
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)
  if (linkId) query = query.eq('payment_link_id', linkId)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count ?? 0, page, limit })
}

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export interface TrendPoint {
  date: string // YYYY-MM-DD
  count: number
  revenue: number
}

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cs) { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const days = 30
    const since = new Date()
    since.setUTCDate(since.getUTCDate() - days + 1)
    since.setUTCHours(0, 0, 0, 0)

    const sb = createServerSupabase()
    const { data, error } = await sb
      .from('transactions')
      .select('created_at, amount, status')
      .eq('user_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Initialize all 30 days with zero
    const map = new Map<string, { count: number; revenue: number }>()
    for (let i = 0; i < days; i++) {
      const d = new Date(since)
      d.setUTCDate(d.getUTCDate() + i)
      map.set(d.toISOString().slice(0, 10), { count: 0, revenue: 0 })
    }

    for (const tx of data ?? []) {
      const key = (tx.created_at as string)?.slice(0, 10)
      if (!key) continue
      const entry = map.get(key)
      if (entry) {
        entry.count += 1
        if (tx.status === 'confirmed') entry.revenue += tx.amount
      }
    }

    const trends: TrendPoint[] = Array.from(map.entries()).map(([date, v]) => ({
      date,
      count: v.count,
      revenue: v.revenue,
    }))

    return NextResponse.json({ data: trends })
  } catch (e) {
    console.error('trends error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

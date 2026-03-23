import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { webhookUrlSchema } from '@/lib/validations'
import { z } from 'zod'
import { checkUserRateLimit } from '@/lib/rate-limit'
import { LIMITS } from '@/lib/constants'
import { ApiError } from '@/lib/api-errors'

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

const createSchema = z.object({
  url: webhookUrlSchema,
  label: z.string().min(1).max(100),
})

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServerSupabase()
  const { data, error } = await sb
    .from('webhooks')
    .select('id, label, url, is_active, last_triggered_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkUserRateLimit(user.id, 'webhook-create', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds)
  if (!allowed) return ApiError.tooManyRequests()

  try {
    const body = await req.json()
    const parsed = createSchema.parse(body)

    const sb = createServerSupabase()

    // Limit: max 5 webhooks per user
    const { count } = await sb
      .from('webhooks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: 'Maksimal 5 webhook per akun.' }, { status: 400 })
    }

    const secret = crypto.randomBytes(32).toString('hex')
    const { data, error } = await sb
      .from('webhooks')
      .insert({ user_id: user.id, url: parsed.url, label: parsed.label, secret })
      .select('id, label, url, is_active, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: { ...data, secret } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

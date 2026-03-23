import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
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

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkUserRateLimit(user.id, 'webhook-update', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds)
  if (!allowed) return ApiError.tooManyRequests()

  const body = await req.json()
  const sb = createServerSupabase()
  const { data, error } = await sb
    .from('webhooks')
    .update({ is_active: body.is_active })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, label, url, is_active')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkUserRateLimit(user.id, 'webhook-delete', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds)
  if (!allowed) return ApiError.tooManyRequests()

  const sb = createServerSupabase()
  const { error } = await sb
    .from('webhooks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

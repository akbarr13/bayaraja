import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
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

const bulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(['activate', 'deactivate', 'delete']),
})

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkUserRateLimit(user.id, 'link-bulk', LIMITS.rateLimit.authenticated.max, LIMITS.rateLimit.authenticated.windowSeconds)
  if (!allowed) return ApiError.tooManyRequests()

  try {
    const body = await req.json()
    const { ids, action } = bulkSchema.parse(body)

    const sb = createServerSupabase()

    if (action === 'delete') {
      const { error } = await sb
        .from('payment_links')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await sb
        .from('payment_links')
        .update({ is_active: action === 'activate' })
        .in('id', ids)
        .eq('user_id', user.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, affected: ids.length })
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

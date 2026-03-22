import { type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}

/**
 * Rate limit berdasarkan user ID (untuk endpoint authenticated).
 * Returns true jika masih dalam batas, false jika sudah over limit.
 */
export async function checkUserRateLimit(
  userId: string,
  endpoint: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const sb = createServerSupabase()
  const { data } = await sb.rpc('check_rate_limit', {
    p_ip: `user:${userId}`,
    p_endpoint: endpoint,
    p_max: max,
    p_window_seconds: windowSeconds,
  })
  return data !== false
}

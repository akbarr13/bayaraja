import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const sb = createServerSupabase()

  const ip = getClientIp(req)
  const { data: allowed } = await sb.rpc('check_rate_limit', {
    p_ip: ip,
    p_endpoint: 'tx-status',
    p_max: 30,
    p_window_seconds: 60,
  })
  if (allowed === false) {
    return NextResponse.json(
      { error: 'Terlalu banyak request.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const { data, error } = await sb
    .from('transactions')
    .select('status')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ status: data.status })
}

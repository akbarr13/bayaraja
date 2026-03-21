import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const sb = createServerSupabase()

  // Require API key
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'API key diperlukan.' }, { status: 401 })
  }
  const keyHash = crypto.createHash('sha256').update(authHeader.slice(7)).digest('hex')

  const { data: apiKeyRecord } = await sb
    .from('api_keys')
    .select('id, user_id, is_active')
    .eq('key_hash', keyHash)
    .single()

  if (!apiKeyRecord?.is_active) {
    return NextResponse.json({ error: 'API key tidak valid.' }, { status: 401 })
  }

  // Update last_used_at
  await sb.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', apiKeyRecord.id)

  // Get payment link — must belong to the API key owner
  const { data: link } = await sb
    .from('payment_links')
    .select('id, title, amount, is_active, is_single_use, expires_at')
    .eq('slug', slug)
    .eq('user_id', apiKeyRecord.user_id)
    .single()

  if (!link) {
    return NextResponse.json({ error: 'Payment link tidak ditemukan.' }, { status: 404 })
  }

  // Get transactions for this link
  const { data: transactions } = await sb
    .from('transactions')
    .select('id, status, amount, payer_name, payer_email, created_at')
    .eq('payment_link_id', link.id)
    .order('created_at', { ascending: false })

  const confirmed = transactions?.filter((t) => t.status === 'confirmed') ?? []
  const pending = transactions?.filter((t) => t.status === 'pending') ?? []

  return NextResponse.json({
    slug,
    title: link.title,
    amount: link.amount,
    is_active: link.is_active,
    expires_at: link.expires_at,
    paid: confirmed.length > 0,
    summary: {
      confirmed: confirmed.length,
      pending: pending.length,
      total: transactions?.length ?? 0,
    },
    latest_transaction: confirmed[0] ?? pending[0] ?? null,
  })
}

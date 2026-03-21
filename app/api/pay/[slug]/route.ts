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
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const sb = createServerSupabase()

  try {
    // Rate limit
    const ip = getClientIp(req)
    const { data: allowed } = await sb.rpc('check_rate_limit', {
      p_ip: ip,
      p_endpoint: 'pay-page',
      p_max: 30,
      p_window_seconds: 60,
    })
    if (allowed === false) {
      return NextResponse.json(
        { error: 'Terlalu banyak request. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Get payment link with QRIS account (service role, bypasses RLS)
    const { data: link, error } = await sb
      .from('payment_links')
      .select('*, qris_account:qris_accounts(merchant_name)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !link) {
      return NextResponse.json(
        { error: 'Payment link tidak ditemukan atau sudah tidak aktif.' },
        { status: 404 }
      )
    }

    // Check expiry
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Payment link sudah kadaluarsa.' },
        { status: 410 }
      )
    }

    // Check single-use: if already has a confirmed transaction
    if (link.is_single_use) {
      const { data: confirmed } = await sb
        .from('transactions')
        .select('id')
        .eq('payment_link_id', link.id)
        .eq('status', 'confirmed')
        .limit(1)

      if (confirmed && confirmed.length > 0) {
        return NextResponse.json(
          { error: 'Payment link ini hanya bisa digunakan sekali dan sudah digunakan.' },
          { status: 410 }
        )
      }
    }

    return NextResponse.json({
      data: {
        id: link.id,
        title: link.title,
        description: link.description,
        amount: link.amount,
        merchant_name: link.qris_account.merchant_name,
        qr_image_url: `/api/pay/${slug}/qr`,
      },
    })
  } catch (e) {
    console.error('pay/[slug] error:', e)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { convertQrisDinamis } from '@/lib/qris'
import QRCode from 'qrcode'

// In-memory QR cache: qrisDynamic string → PNG buffer
const qrCache = new Map<string, Buffer>()

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const sb = createServerSupabase()

  try {
    const { data: link, error } = await sb
      .from('payment_links')
      .select('amount, is_active, expires_at, qris_account:qris_accounts(qris_string)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !link) {
      return new NextResponse(null, { status: 404 })
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return new NextResponse(null, { status: 410 })
    }

    const account = Array.isArray(link.qris_account) ? link.qris_account[0] : link.qris_account
    const qrisStatic = (account as { qris_string: string }).qris_string
    const qrisDynamic = convertQrisDinamis(qrisStatic, link.amount)

    let pngBuffer = qrCache.get(qrisDynamic)
    if (!pngBuffer) {
      pngBuffer = await QRCode.toBuffer(qrisDynamic, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'M',
      })
      qrCache.set(qrisDynamic, pngBuffer)
    }

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (e) {
    console.error('pay/[slug]/qr error:', e)
    return new NextResponse(null, { status: 500 })
  }
}

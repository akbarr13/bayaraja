import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { convertQrisDinamis } from '@/lib/qris'
import { createAmountSchema } from '@/lib/validations'
import QRCode from 'qrcode'
import crypto from 'crypto'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const sb = createServerSupabase()

  try {
    // Extract API key from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'API key diperlukan.' }, { status: 401 })
    }
    const apiKey = authHeader.slice(7)

    // Hash the key and look up
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')

    const { data: apiKeyRecord } = await sb
      .from('api_keys')
      .select('id, user_id, is_active')
      .eq('key_hash', keyHash)
      .single()

    if (!apiKeyRecord || !apiKeyRecord.is_active) {
      return NextResponse.json({ error: 'API key tidak valid.' }, { status: 401 })
    }

    // Rate limit per API key
    const ip = getClientIp(req)
    const { data: allowed } = await sb.rpc('check_rate_limit', {
      p_ip: ip,
      p_endpoint: `create-amount-${apiKeyRecord.id}`,
      p_max: 60,
      p_window_seconds: 60,
    })
    if (allowed === false) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 60 requests/menit.' },
        { status: 429 }
      )
    }

    // Update last_used_at
    await sb
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyRecord.id)

    // Parse and validate body
    const body = await req.json()
    const parsed = createAmountSchema.parse(body)

    // Get QRIS account
    let qrisQuery = sb
      .from('qris_accounts')
      .select('qris_string, merchant_name')
      .eq('user_id', apiKeyRecord.user_id)

    if (parsed.qris_account_id) {
      qrisQuery = qrisQuery.eq('id', parsed.qris_account_id)
    } else {
      qrisQuery = qrisQuery.eq('is_default', true)
    }

    const { data: qris } = await qrisQuery.single()

    if (!qris) {
      // Try first available if no default
      const { data: fallback } = await sb
        .from('qris_accounts')
        .select('qris_string, merchant_name')
        .eq('user_id', apiKeyRecord.user_id)
        .limit(1)
        .single()

      if (!fallback) {
        return NextResponse.json(
          { error: 'Tidak ada QRIS account. Tambahkan QRIS terlebih dahulu.' },
          { status: 404 }
        )
      }

      const qrisDynamic = convertQrisDinamis(fallback.qris_string, parsed.amount)
      const qrImageUrl = await QRCode.toDataURL(qrisDynamic, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'M',
      })

      return NextResponse.json({
        success: true,
        data: {
          qris_dynamic: qrisDynamic,
          qr_image_url: qrImageUrl,
          amount: parsed.amount,
          merchant_name: fallback.merchant_name,
          expires_in: null,
        },
      })
    }

    const qrisDynamic = convertQrisDinamis(qris.qris_string, parsed.amount)
    const qrImageUrl = await QRCode.toDataURL(qrisDynamic, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
    })

    return NextResponse.json({
      success: true,
      data: {
        qris_dynamic: qrisDynamic,
        qr_image_url: qrImageUrl,
        amount: parsed.amount,
        merchant_name: qris.merchant_name,
        expires_in: null,
      },
    })
  } catch (e) {
    console.error('create-amount error:', e)
    if (e && typeof e === 'object' && 'issues' in e) {
      return NextResponse.json({ error: 'Validasi gagal', details: e }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

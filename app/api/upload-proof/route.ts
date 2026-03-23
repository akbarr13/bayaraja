import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { ALLOWED_IMAGE_TYPES, LIMITS, MIME_TO_EXT } from '@/lib/constants'
import { fireWebhooks } from '@/lib/webhook'
import { ApiError } from '@/lib/api-errors'

/** Validate file magic bytes match claimed MIME type */
function validateMagicBytes(buffer: ArrayBuffer, mime: string): boolean {
  const bytes = new Uint8Array(buffer)
  if (bytes.length < 12) return false

  switch (mime) {
    case 'image/jpeg':
      // JPEG: starts with FF D8 FF
      return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    case 'image/png':
      // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
      return (
        bytes[0] === 0x89 && bytes[1] === 0x50 &&
        bytes[2] === 0x4E && bytes[3] === 0x47 &&
        bytes[4] === 0x0D && bytes[5] === 0x0A &&
        bytes[6] === 0x1A && bytes[7] === 0x0A
      )
    case 'image/webp':
      // WebP: starts with RIFF....WEBP
      return (
        bytes[0] === 0x52 && bytes[1] === 0x49 &&
        bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 &&
        bytes[10] === 0x42 && bytes[11] === 0x50
      )
    default:
      return false
  }
}

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
    const ip = getClientIp(req)

    const formData = await req.formData()
    const paymentLinkId = formData.get('payment_link_id') as string
    const file = formData.get('file') as File
    const payerName = (formData.get('payer_name') as string) || null
    const payerEmail = (formData.get('payer_email') as string) || null

    if (!paymentLinkId || !file) {
      return ApiError.badRequest('Data tidak lengkap.')
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
      return ApiError.badRequest('Tipe file tidak diizinkan.')
    }

    if (file.size > LIMITS.maxFileSize) {
      return ApiError.badRequest('Ukuran file maksimal 5MB.')
    }

    // Rate limit (global IP) + link verification in parallel
    const [{ data: allowed }, { data: link }] = await Promise.all([
      sb.rpc('check_rate_limit', {
        p_ip: ip,
        p_endpoint: 'upload-proof',
        p_max: LIMITS.rateLimit.paymentProof.max,
        p_window_seconds: LIMITS.rateLimit.paymentProof.windowSeconds,
      }),
      sb
        .from('payment_links')
        .select('id, user_id, amount, is_active, is_single_use, expires_at')
        .eq('id', paymentLinkId)
        .single(),
    ])

    if (allowed === false) return ApiError.tooManyRequests()

    if (!link || !link.is_active) {
      return ApiError.notFound('Payment link tidak valid.')
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return ApiError.gone('Payment link sudah kadaluarsa.')
    }

    // Per-IP-per-link rate limit + pending cap in parallel
    const [{ data: allowedPerLink }, { count: pendingCount }] = await Promise.all([
      sb.rpc('check_rate_limit', {
        p_ip: ip,
        p_endpoint: `upload-proof:${link.id}`,
        p_max: LIMITS.rateLimit.paymentProofPerLink.max,
        p_window_seconds: LIMITS.rateLimit.paymentProofPerLink.windowSeconds,
      }),
      sb
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('payment_link_id', link.id)
        .eq('status', 'pending'),
    ])

    if (allowedPerLink === false) return ApiError.tooManyRequests()

    if (pendingCount !== null && pendingCount >= LIMITS.pendingPerLink) {
      return ApiError.conflict('Terlalu banyak bukti pembayaran menunggu konfirmasi. Silakan coba lagi nanti.')
    }

    if (link.is_single_use) {
      if (pendingCount && pendingCount > 0) {
        return ApiError.conflict('Bukti pembayaran sudah dikirim. Silakan tunggu konfirmasi penjual.')
      }
    }

    // Create transaction first to get ID
    const { data: tx, error: txErr } = await sb
      .from('transactions')
      .insert({
        payment_link_id: link.id,
        user_id: link.user_id,
        amount: link.amount,
        payer_name: payerName,
        payer_email: payerEmail,
        status: 'pending',
        payment_proof: '',
        ip_address: ip,
      })
      .select('id')
      .single()

    if (txErr || !tx) return ApiError.serverError('Gagal membuat transaksi.')

    // Upload file
    const ext = MIME_TO_EXT[file.type] ?? 'jpg'
    const path = `${link.user_id}/${tx.id}.${ext}`

    const arrayBuffer = await file.arrayBuffer()

    // Validate magic bytes match claimed MIME type
    if (!validateMagicBytes(arrayBuffer, file.type)) {
      await sb.from('transactions').delete().eq('id', tx.id)
      return ApiError.badRequest('File tidak valid. Pastikan file adalah gambar asli (JPEG/PNG/WebP).')
    }
    const { error: upErr } = await sb.storage
      .from('payment-proofs')
      .upload(path, arrayBuffer, { contentType: file.type })

    if (upErr) {
      // Cleanup orphan transaction
      await sb.from('transactions').delete().eq('id', tx.id)
      throw upErr
    }

    // Update transaction with proof path
    const { error: updateErr } = await sb
      .from('transactions')
      .update({ payment_proof: path })
      .eq('id', tx.id)

    if (updateErr) {
      await sb.storage.from('payment-proofs').remove([path])
      await sb.from('transactions').delete().eq('id', tx.id)
      throw updateErr
    }

    // Fire webhook async — do not await, never block
    fireWebhooks(link.user_id, 'transaction.created', {
      transaction_id: tx.id,
      payment_link_id: link.id,
      amount: link.amount,
      payer_name: payerName,
      payer_email: payerEmail,
    })

    return NextResponse.json({ success: true, transaction_id: tx.id })
  } catch (e) {
    console.error('upload-proof error:', e)
    return ApiError.serverError()
  }
}

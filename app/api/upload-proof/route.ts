import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { ALLOWED_IMAGE_TYPES, LIMITS, MIME_TO_EXT } from '@/lib/constants'

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
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 })
    }

    // Validate MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan.' }, { status: 400 })
    }

    if (file.size > LIMITS.maxFileSize) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5MB.' }, { status: 400 })
    }

    // Rate limit and link verification in parallel
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

    if (allowed === false) {
      return NextResponse.json(
        { error: 'Terlalu banyak request. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    if (!link || !link.is_active) {
      return NextResponse.json({ error: 'Payment link tidak valid.' }, { status: 404 })
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Payment link sudah kadaluarsa.' }, { status: 410 })
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

    if (txErr || !tx) {
      return NextResponse.json({ error: 'Gagal membuat transaksi.' }, { status: 500 })
    }

    // Upload file
    const ext = MIME_TO_EXT[file.type] ?? 'jpg'
    const path = `${link.user_id}/${tx.id}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
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

    return NextResponse.json({ success: true, transaction_id: tx.id })
  } catch (e) {
    console.error('upload-proof error:', e)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

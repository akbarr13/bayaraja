import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

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

export async function POST(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServerSupabase()
  const { data: webhook } = await sb
    .from('webhooks')
    .select('id, url, secret')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!webhook) return NextResponse.json({ error: 'Webhook tidak ditemukan' }, { status: 404 })

  const payload = {
    event: 'transaction.created',
    created_at: new Date().toISOString(),
    data: {
      id: 'test-00000000-0000-0000-0000-000000000000',
      payment_link_id: 'test',
      payer_name: 'Test User',
      payer_email: 'test@example.com',
      amount: 50000,
      status: 'pending',
      created_at: new Date().toISOString(),
      is_test: true,
    },
  }

  const body = JSON.stringify(payload)
  const sig = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bayaraja-Event': 'transaction.created',
        'X-Bayaraja-Signature': `sha256=${sig}`,
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.ok) {
      await sb
        .from('webhooks')
        .update({ last_triggered_at: new Date().toISOString() })
        .eq('id', id)
      return NextResponse.json({ success: true, status_code: res.status })
    }
    return NextResponse.json(
      { error: `Endpoint merespons dengan status ${res.status}` },
      { status: 422 }
    )
  } catch {
    return NextResponse.json({ error: 'Gagal menghubungi URL webhook' }, { status: 502 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabase } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

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

function csvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const linkId = searchParams.get('link_id')
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const sb = createServerSupabase()
  let query = sb
    .from('transactions')
    .select('*, payment_link:payment_links(title, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (linkId) query = query.eq('payment_link_id', linkId)
  if (status && ['pending', 'confirmed', 'rejected'].includes(status)) {
    query = query.eq('status', status)
  }
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data ?? []
  const header = ['ID', 'Tanggal', 'Link', 'Slug', 'Pembayar', 'Email', 'Nominal', 'Status', 'Catatan']
  const lines = [
    header.join(','),
    ...rows.map((tx) => [
      csvCell(tx.id),
      csvCell(new Date(tx.created_at).toLocaleString('id-ID')),
      csvCell(tx.payment_link?.title ?? tx.payment_link_id),
      csvCell(tx.payment_link?.slug ?? ''),
      csvCell(tx.payer_name),
      csvCell(tx.payer_email),
      csvCell(tx.amount),
      csvCell(tx.status),
      csvCell(tx.notes),
    ].join(',')),
  ]

  // BOM for Excel compatibility
  const csv = '\uFEFF' + lines.join('\n')
  const filename = `transaksi-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

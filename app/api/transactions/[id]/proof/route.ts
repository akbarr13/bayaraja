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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role client to bypass Storage RLS
  const sb = createServerSupabase()

  // Verify the transaction belongs to the authenticated user
  const { data: tx, error: txErr } = await sb
    .from('transactions')
    .select('payment_proof, user_id')
    .eq('id', id)
    .single()

  if (txErr || !tx || tx.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!tx.payment_proof) {
    return NextResponse.json({ error: 'No proof uploaded' }, { status: 404 })
  }

  const { data, error } = await sb.storage
    .from('payment-proofs')
    .createSignedUrl(tx.payment_proof, 3600)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? 'Failed to generate URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}

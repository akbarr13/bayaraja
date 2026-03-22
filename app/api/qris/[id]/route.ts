import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { qrisAccountSchema } from '@/lib/validations'

async function getSupabaseWithUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('qris_accounts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = qrisAccountSchema.partial().parse(body)

    // Unset other defaults server-side
    if (parsed.is_default) {
      await supabase
        .from('qris_accounts')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', id)
    }

    const { data, error } = await supabase
      .from('qris_accounts')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { count } = await supabase
    .from('payment_links')
    .select('id', { count: 'exact', head: true })
    .eq('qris_account_id', id)
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (count && count > 0) {
    return NextResponse.json(
      { error: 'QRIS ini masih digunakan oleh payment link aktif. Nonaktifkan atau hapus payment link terlebih dahulu.' },
      { status: 409 }
    )
  }

  const { error } = await supabase
    .from('qris_accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

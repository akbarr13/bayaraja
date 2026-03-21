import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { apiKeySchema } from '@/lib/validations'
import crypto from 'crypto'

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

export async function GET() {
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, label, is_active, last_used_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = apiKeySchema.parse(body)

    // Check limit
    const { count } = await supabase
      .from('api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 5) {
      return NextResponse.json(
        { error: 'Maksimal 5 API key per akun.' },
        { status: 400 }
      )
    }

    // Generate API key
    const plainKey = `byr_${crypto.randomBytes(32).toString('hex')}`
    const keyHash = crypto.createHash('sha256').update(plainKey).digest('hex')

    const { error } = await supabase.from('api_keys').insert({
      user_id: user.id,
      key_hash: keyHash,
      label: parsed.label,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return plain key ONCE
    return NextResponse.json(
      {
        data: {
          key: plainKey,
          label: parsed.label,
          message: 'Simpan API key ini. Key tidak akan ditampilkan lagi.',
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { supabase, user } = await getSupabaseWithUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 })
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

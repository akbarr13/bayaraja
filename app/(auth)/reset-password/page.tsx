'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionValid, setSessionValid] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const { data } = await getBrowserSupabase().auth.getSession()
      setSessionValid(!!data.session)
    }
    check()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Password tidak cocok')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const supabase = getBrowserSupabase()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal reset password')
    } finally {
      setLoading(false)
    }
  }

  if (sessionValid === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
      </div>
    )
  }

  if (!sessionValid) {
    return (
      <div>
        <div className="mb-8 lg:hidden">
          <Link href="/" className="text-xl font-heading font-bold text-[#1E293B] hover:opacity-70 transition-opacity">
            Bayaraja
          </Link>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-5 text-center">
          <p className="font-medium text-red-800">Link tidak valid atau sudah kadaluarsa</p>
          <p className="mt-1 text-sm text-red-700">
            Minta link reset password baru dan coba lagi.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/forgot-password" className="font-medium text-[#2563EB] hover:underline">
            Minta link baru
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 lg:hidden">
        <Link href="/" className="text-xl font-heading font-bold text-[#1E293B] hover:opacity-70 transition-opacity">
          Bayaraja
        </Link>
      </div>

      <h1 className="text-2xl font-heading font-bold text-[#1E293B]">Reset password</h1>
      <p className="mt-1 text-sm text-gray-500">Masukkan password baru untuk akun Anda.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          id="password"
          label="Password baru"
          type="password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
          required
        />
        <Input
          id="confirm"
          label="Konfirmasi password"
          type="password"
          placeholder="Ulangi password baru"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          showToggle
          required
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Simpan password baru
        </Button>
      </form>
    </div>
  )
}

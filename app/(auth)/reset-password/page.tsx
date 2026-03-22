'use client'

import { useState } from 'react'
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
  const router = useRouter()

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
          required
        />
        <Input
          id="confirm"
          label="Konfirmasi password"
          type="password"
          placeholder="Ulangi password baru"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const RESEND_COOLDOWN = 60

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN)
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  async function sendReset() {
    setError('')
    setLoading(true)
    try {
      const supabase = getBrowserSupabase()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
      startCooldown()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim email')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendReset()
  }

  if (sent) {
    return (
      <div>
        <div className="mb-8 lg:hidden">
          <Link href="/" className="text-xl font-heading font-bold text-[#1E293B] hover:opacity-70 transition-opacity">
            Bayaraja
          </Link>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
          <p className="font-medium text-green-800">Email terkirim!</p>
          <p className="mt-1 text-sm text-green-700">
            Cek inbox <strong>{email}</strong> dan klik link untuk reset password.
          </p>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-center">{error}</p>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={sendReset}
            disabled={cooldown > 0 || loading}
            className="text-sm font-medium text-[#2563EB] hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : 'Kirim ulang'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
            Kembali ke login
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

      <h1 className="text-2xl font-heading font-bold text-[#1E293B]">Lupa password?</h1>
      <p className="mt-1 text-sm text-gray-500">Masukkan email Anda untuk menerima link reset password.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          Kirim link reset
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Ingat password?{' '}
        <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}

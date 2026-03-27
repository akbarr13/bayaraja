'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, XCircle, WifiOff, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentSuccessProps {
  transactionId: string
  referrer?: string | null
  onRetry?: () => void
}

type TxStatus = 'pending' | 'confirmed' | 'rejected'

const INITIAL_INTERVAL = 5000
const MAX_INTERVAL = 60000
const BACKOFF_FACTOR = 1.5
const MAX_ERRORS = 5

export function PaymentSuccess({ transactionId, referrer, onRetry }: PaymentSuccessProps) {
  const [status, setStatus] = useState<TxStatus>('pending')
  const [networkError, setNetworkError] = useState(false)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef(INITIAL_INTERVAL)
  const errorCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  function scheduleNext() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(poll, intervalRef.current)
  }

  async function poll() {
    try {
      const res = await fetch(`/api/transactions/${transactionId}/status`)
      if (res.ok) {
        const data = await res.json()
        errorCountRef.current = 0
        setNetworkError(false)
        if (data.status === 'confirmed' || data.status === 'rejected') {
          setStatus(data.status)
          return
        }
      }
    } catch {
      errorCountRef.current += 1
      if (errorCountRef.current >= MAX_ERRORS) {
        setNetworkError(true)
        return
      }
    }
    intervalRef.current = Math.min(intervalRef.current * BACKOFF_FACTOR, MAX_INTERVAL)
    scheduleNext()
  }

  function retryPolling() {
    errorCountRef.current = 0
    intervalRef.current = INITIAL_INTERVAL
    setNetworkError(false)
    poll()
  }

  useEffect(() => {
    if (status !== 'pending') return
    scheduleNext()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, status])

  const backButton = referrer && (
    <a
      href={referrer}
      className="mt-5 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Kembali ke {new URL(referrer).hostname}
    </a>
  )

  const baseClass = `flex flex-col items-center text-center py-6 transition-all duration-500 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`

  if (status === 'confirmed') {
    return (
      <div className={baseClass}>
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50 transition-transform duration-700 ${visible ? 'scale-100' : 'scale-50'}`}
          >
            <CheckCircle2 className="h-9 w-9 text-green-500" />
          </div>
        </div>
        <h2 className="text-xl font-heading font-bold text-text">Pembayaran Dikonfirmasi!</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
          Pembayaran Anda telah dikonfirmasi oleh penjual.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2">
          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
          <p className="text-xs font-medium text-green-700">Pembayaran berhasil</p>
        </div>
        {backButton}
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className={baseClass}>
        <div className="relative mb-5">
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50 transition-transform duration-700 ${visible ? 'scale-100' : 'scale-50'}`}
          >
            <XCircle className="h-9 w-9 text-red-400" />
          </div>
        </div>
        <h2 className="text-xl font-heading font-bold text-text">Pembayaran Ditolak</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
          Bukti pembayaran Anda ditolak oleh penjual. Hubungi penjual untuk informasi lebih lanjut.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
            Upload Ulang Bukti
          </Button>
        )}
        {backButton}
      </div>
    )
  }

  if (networkError) {
    return (
      <div className={baseClass}>
        <div className="relative mb-5">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <WifiOff className="h-9 w-9 text-gray-400" />
          </div>
        </div>
        <h2 className="text-xl font-heading font-bold text-text">Koneksi Bermasalah</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
          Tidak dapat memuat status pembayaran. Periksa koneksi internet Anda.
        </p>
        <button
          onClick={retryPolling}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Coba Lagi
        </button>
        {backButton}
      </div>
    )
  }

  // pending
  return (
    <div className={baseClass}>
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50 transition-transform duration-700 ${visible ? 'scale-100' : 'scale-50'}`}
        >
          <CheckCircle2 className="h-9 w-9 text-green-500" />
        </div>
      </div>

      <h2 className="text-xl font-heading font-bold text-text">Bukti Terkirim!</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
        Terima kasih. Bukti pembayaran Anda sudah kami terima dan sedang diverifikasi.
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2">
        <Loader2 className="h-4 w-4 text-amber-500 flex-shrink-0 animate-spin" />
        <p className="text-xs font-medium text-amber-700">Menunggu konfirmasi dari penjual</p>
      </div>

      {backButton}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

interface PaymentSuccessProps {
  transactionId: string
}

type TxStatus = 'pending' | 'confirmed' | 'rejected'

export function PaymentSuccess({ transactionId }: PaymentSuccessProps) {
  const [status, setStatus] = useState<TxStatus>('pending')

  useEffect(() => {
    if (status === 'confirmed' || status === 'rejected') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transactions/${transactionId}/status`)
        if (res.ok) {
          const data = await res.json()
          if (data.status === 'confirmed' || data.status === 'rejected') {
            setStatus(data.status)
          }
        }
      } catch {
        // silently ignore network errors during polling
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [transactionId, status])

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
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
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-5">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-9 w-9 text-red-400" />
          </div>
        </div>
        <h2 className="text-xl font-heading font-bold text-text">Pembayaran Ditolak</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
          Bukti pembayaran Anda ditolak oleh penjual. Hubungi penjual untuk informasi lebih lanjut.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center py-6">
      {/* Icon */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-9 w-9 text-green-500" />
        </div>
      </div>

      <h2 className="text-xl font-heading font-bold text-text">
        Bukti Terkirim!
      </h2>
      <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
        Terima kasih. Bukti pembayaran Anda sudah kami terima dan sedang diverifikasi.
      </p>

      {/* Status badge */}
      <div className="mt-5 flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2">
        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs font-medium text-amber-700">Menunggu konfirmasi dari penjual</p>
      </div>

      <p className="mt-5 text-xs text-gray-400">
        Halaman ini akan otomatis diperbarui.
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Download, Loader2, Check, AlertCircle } from 'lucide-react'
import { formatRp } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface QrDisplayProps {
  qrImageUrl: string
  amount: number
  title: string
  merchantName?: string | null
}

type DownloadState = 'idle' | 'loading' | 'done' | 'error'

export function QrDisplay({ qrImageUrl, amount, title, merchantName }: QrDisplayProps) {
  const [dlState, setDlState] = useState<DownloadState>('idle')

  async function handleDownload() {
    if (dlState === 'loading') return
    setDlState('loading')
    try {
      const res = await fetch(qrImageUrl)
      if (!res.ok) throw new Error('fetch failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qris-${title.toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
      URL.revokeObjectURL(url)
      setDlState('done')
      setTimeout(() => setDlState('idle'), 2000)
    } catch {
      setDlState('error')
      setTimeout(() => setDlState('idle'), 3000)
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Amount — primary focal point */}
      <div className="mb-4 rounded-2xl bg-primary/8 px-6 py-3">
        <p className="text-3xl font-heading font-bold text-primary tracking-tight">
          {formatRp(amount)}
        </p>
      </div>

      {/* Merchant info */}
      <div className="mb-5 w-full">
        <h1 className="text-base font-heading font-semibold text-text">{title}</h1>
        {merchantName && (
          <p className="text-xs text-gray-500 mt-0.5">{merchantName}</p>
        )}
      </div>

      {/* QR code */}
      <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <img
          src={qrImageUrl}
          alt={`QRIS QR Code — ${title}`}
          className="h-56 w-56"
        />
      </div>

      {/* Instructions */}
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        Scan menggunakan GoPay, OVO, Dana, ShopeePay,<br />
        mobile banking, atau e-wallet apapun yang support QRIS
      </p>

      {/* Download button */}
      <button
        type="button"
        onClick={handleDownload}
        aria-label="Unduh QR"
        disabled={dlState === 'loading'}
        className={cn(
          'mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
          dlState === 'done' && 'border-green-200 bg-green-50 text-green-700',
          dlState === 'error' && 'border-red-200 bg-red-50 text-red-600',
          (dlState === 'idle' || dlState === 'loading') && 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
          dlState === 'loading' && 'opacity-70 cursor-not-allowed'
        )}
      >
        {dlState === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {dlState === 'done' && <Check className="h-3.5 w-3.5" />}
        {dlState === 'error' && <AlertCircle className="h-3.5 w-3.5" />}
        {dlState === 'idle' && <Download className="h-3.5 w-3.5" />}
        {dlState === 'idle' && 'Simpan QR ke HP'}
        {dlState === 'loading' && 'Mengunduh...'}
        {dlState === 'done' && 'Tersimpan!'}
        {dlState === 'error' && 'Gagal, coba lagi'}
      </button>
    </div>
  )
}

'use client'

import { Download } from 'lucide-react'
import { formatRp } from '@/lib/utils'

interface QrDisplayProps {
  qrImageUrl: string
  amount: number
  title: string
  merchantName?: string | null
}

export function QrDisplay({ qrImageUrl, amount, title, merchantName }: QrDisplayProps) {
  async function handleDownload() {
    const res = await fetch(qrImageUrl)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qris-${title.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Merchant info */}
      <div className="mb-4 w-full">
        <h1 className="text-lg font-heading font-bold text-text">{title}</h1>
        {merchantName && (
          <p className="text-sm text-gray-500 mt-0.5">{merchantName}</p>
        )}
      </div>

      {/* Amount badge */}
      <div className="mb-5 rounded-full bg-primary/8 px-5 py-2">
        <p className="text-2xl font-bold text-primary">{formatRp(amount)}</p>
      </div>

      {/* QR code */}
      <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <img
          src={qrImageUrl}
          alt="QRIS QR Code"
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
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        Simpan QR ke HP
      </button>
    </div>
  )
}

'use client'

import { useEffect, useState, use } from 'react'
import { QrDisplay } from '@/components/pay/qr-display'
import { PaymentForm } from '@/components/pay/payment-form'
import { PaymentSuccess } from '@/components/pay/payment-success'
import { fetchWithTimeout } from '@/lib/utils'
import { LinkIcon, RefreshCw } from 'lucide-react'

interface PayData {
  id: string
  title: string
  description: string | null
  amount: number
  merchant_name: string | null
  qr_image_url: string
}

interface ErrorState {
  message: string
  canRefresh: boolean
}

function mapPayError(status: number, message: string): ErrorState {
  if (status === 404) return { message: 'Link tidak ditemukan. Periksa kembali URL.', canRefresh: false }
  if (status === 410) return { message: 'Link sudah kadaluarsa/terpakai. Hubungi penjual.', canRefresh: false }
  if (status === 429) return { message: 'Terlalu banyak percobaan. Tunggu lalu coba lagi.', canRefresh: true }
  if (!status) return { message: 'Koneksi terputus. Periksa internet Anda.', canRefresh: true }
  return { message: message || 'Link tidak ditemukan atau tidak aktif.', canRefresh: false }
}

export default function PayPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params)
  const [data, setData] = useState<PayData | null>(null)
  const [errorState, setErrorState] = useState<ErrorState | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setErrorState(null)
    try {
      const res = await fetchWithTimeout(`/api/pay/${slug}`)
      const json = await res.json()
      if (!res.ok) {
        setErrorState(mapPayError(res.status, json.error || ''))
      } else {
        setData(json.data)
      }
    } catch {
      setErrorState({ message: 'Koneksi terputus. Periksa internet Anda.', canRefresh: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="border-b border-gray-100 bg-white px-4 py-3">
          <div className="mx-auto max-w-md">
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-1 items-start justify-center px-4 pt-8">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-28 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-56 w-56 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-24 rounded-xl bg-gray-200 animate-pulse" />
              <div className="h-9 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (errorState || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
            <LinkIcon className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-xl font-heading font-bold text-text mb-2">
            Link Tidak Tersedia
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {errorState?.message || 'Payment link ini tidak ditemukan atau tidak aktif.'}
          </p>
          {errorState?.canRefresh && (
            <button
              onClick={load}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          )}
        </div>
        <p className="mt-12 text-xs text-gray-400">
          Powered by <span className="font-semibold text-primary">Bayaraja</span>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-4 py-3 text-center">
        <span className="text-sm font-heading font-bold text-text">Bayaraja</span>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mx-auto w-full max-w-md space-y-4">

          {/* Step 1: QR */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {/* Step label */}
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                1
              </div>
              <span className="text-sm font-semibold text-text">Scan & Bayar</span>
            </div>

            <QrDisplay
              qrImageUrl={data.qr_image_url}
              amount={data.amount}
              title={data.title}
              merchantName={data.merchant_name}
            />

            {data.description && (
              <p className="mt-4 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                {data.description}
              </p>
            )}
          </div>

          {/* Step 2: Confirm / Success */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {transactionId ? (
              <PaymentSuccess transactionId={transactionId} />
            ) : (
              <PaymentForm
                paymentLinkId={data.id}
                onSuccess={(txId) => setTransactionId(txId)}
              />
            )}
          </div>

          <p className="text-center text-xs text-gray-400 pb-4">
            Powered by <span className="font-semibold text-primary">Bayaraja</span>
          </p>
        </div>
      </div>
    </div>
  )
}

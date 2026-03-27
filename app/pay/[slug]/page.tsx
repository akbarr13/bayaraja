'use client'

import { useEffect, useState, use } from 'react'
import { QrDisplay } from '@/components/pay/qr-display'
import { PaymentForm } from '@/components/pay/payment-form'
import { PaymentSuccess } from '@/components/pay/payment-success'
import { fetchWithTimeout } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { LinkIcon, RefreshCw, Check, ShieldCheck, Lock } from 'lucide-react'

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

const STEPS = ['Scan QR', 'Upload Bukti', 'Selesai']

export default function PayPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params)
  const [data, setData] = useState<PayData | null>(null)
  const [errorState, setErrorState] = useState<ErrorState | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    if (document.referrer) {
      try {
        const url = new URL(document.referrer)
        if (url.origin !== window.location.origin) {
          setReferrer(document.referrer)
        }
      } catch {
        // invalid URL, ignore
      }
    }
  }, [])

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

  // currentStep: 1 = scan QR, 2 = upload form, 3 = done (success/pending/rejected)
  const currentStep = transactionId ? 3 : 2

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="border-b border-gray-100 bg-white px-4 py-3">
          <div className="mx-auto max-w-md md:max-w-4xl">
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 px-4 py-6 md:py-10">
          <div className="mx-auto w-full max-w-md md:max-w-4xl">
            <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-8 space-y-4 md:space-y-0">
              {/* Left skeleton */}
              <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-36 rounded-2xl bg-gray-200 animate-pulse" />
                  <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                  <div className="h-56 w-56 rounded-xl bg-gray-200 animate-pulse" />
                </div>
              </div>
              {/* Right skeleton */}
              <div className="space-y-4">
                <div className="h-10 rounded-xl bg-white shadow-sm animate-pulse" />
                <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
                  <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                  <div className="h-24 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="h-9 w-full rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
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
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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

      <div className="flex-1 px-4 py-6 md:py-10">
        <div className="mx-auto w-full max-w-md md:max-w-4xl">
          <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-8 space-y-4 md:space-y-0">

            {/* LEFT: QR — sticky on desktop */}
            <div className="md:sticky md:top-6 md:self-start">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
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

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    <span>Transaksi Aman</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200" />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="font-bold text-gray-500">QRIS</span>
                    <span>Standar BI</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200" />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Lock className="h-3 w-3" />
                    <span>SSL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Step indicator + form/success */}
            <div className="space-y-4">

              {/* Step indicator */}
              <nav aria-label="Langkah pembayaran" className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
                {STEPS.map((step, i) => {
                  const stepNum = i + 1
                  const isCompleted = stepNum < currentStep
                  const isActive = stepNum === currentStep
                  return (
                    <div key={step} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div
                          aria-current={isActive ? 'step' : undefined}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors flex-shrink-0',
                            isCompleted && 'bg-green-500 text-white',
                            isActive && 'bg-primary text-white',
                            !isCompleted && !isActive && 'bg-gray-200 text-gray-400'
                          )}
                        >
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNum}
                        </div>
                        <span className={cn(
                          'text-xs font-medium whitespace-nowrap',
                          isActive ? 'text-text' : 'text-gray-400'
                        )}>
                          {step}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn(
                          'h-px flex-1 transition-colors',
                          stepNum < currentStep ? 'bg-green-300' : 'bg-gray-200'
                        )} />
                      )}
                    </div>
                  )
                })}
              </nav>

              {/* Form / Success */}
              <div className={cn(
                'rounded-2xl bg-white p-6 shadow-sm transition-all duration-500',
                transactionId && 'ring-2 ring-green-200'
              )}>
                {transactionId ? (
                  <PaymentSuccess
                    transactionId={transactionId}
                    referrer={referrer}
                    onRetry={() => setTransactionId(null)}
                  />
                ) : (
                  <PaymentForm
                    paymentLinkId={data.id}
                    onSuccess={(txId) => setTransactionId(txId)}
                  />
                )}
              </div>

              <div className="text-center pb-4 space-y-1.5">
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Enkripsi SSL</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    <span>Aman & Terpercaya</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Powered by <span className="font-semibold text-primary">Bayaraja</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

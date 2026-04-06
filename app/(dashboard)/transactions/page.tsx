'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { formatRp } from '@/lib/utils'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { useToast } from '@/components/ui/toast'
import {
  Download, ReceiptText, ExternalLink, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Image as ImageIcon, X,
} from 'lucide-react'
import type { Transaction, PaymentLink } from '@/lib/types'

const PAGE_SIZE = 20

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'rejected'

interface TxWithLink extends Omit<Transaction, 'payment_link'> {
  payment_link?: { title: string; slug: string } | null
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TxWithLink[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [linkFilter, setLinkFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [links, setLinks] = useState<PaymentLink[]>([])

  const [selectedTx, setSelectedTx] = useState<TxWithLink | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [proofLoading, setProofLoading] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const debouncedFrom = useDebounce(fromDate, 400)
  const debouncedTo = useDebounce(toDate, 400)
  const { toast } = useToast()

  // Load user's links for filter dropdown
  useEffect(() => {
    getBrowserSupabase()
      .from('payment_links')
      .select('id, title, slug')
      .order('created_at', { ascending: false })
      .then((res: { data: PaymentLink[] | null }) => setLinks(res.data ?? []))
  }, [])

  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, linkFilter, debouncedFrom, debouncedTo])

  async function loadTransactions() {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    })
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (linkFilter) params.set('link_id', linkFilter)
    if (debouncedFrom) params.set('from', new Date(debouncedFrom).toISOString())
    if (debouncedTo) {
      const to = new Date(debouncedTo)
      to.setHours(23, 59, 59, 999)
      params.set('to', to.toISOString())
    }

    const res = await fetch(`/api/transactions?${params}`)
    if (res.ok) {
      const json = await res.json()
      setTransactions(json.data ?? [])
      setTotal(json.total ?? 0)
    }
    setLoading(false)
  }

  function handleFilterChange() {
    setPage(0)
  }

  async function openTxDetail(tx: TxWithLink) {
    setSelectedTx(tx)
    setProofUrl(null)
    if (tx.payment_proof) {
      setProofLoading(true)
      const res = await fetch(`/api/transactions/${tx.id}/proof`)
      if (res.ok) {
        const data = await res.json()
        setProofUrl(data.url)
      }
      setProofLoading(false)
    }
  }

  async function handleUpdateStatus(txId: string, status: 'confirmed' | 'rejected') {
    const supabase = getBrowserSupabase()
    await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', txId)
    toast(status === 'confirmed' ? 'Transaksi dikonfirmasi' : 'Transaksi ditolak')
    // Update selectedTx state in place
    if (selectedTx?.id === txId) {
      setSelectedTx((prev) => prev ? { ...prev, status } : prev)
    }
    await loadTransactions()
  }

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (linkFilter) params.set('link_id', linkFilter)
    if (debouncedFrom) params.set('from', new Date(debouncedFrom).toISOString())
    if (debouncedTo) {
      const to = new Date(debouncedTo)
      to.setHours(23, 59, 59, 999)
      params.set('to', to.toISOString())
    }
    return `/api/transactions/export?${params}`
  }, [statusFilter, linkFilter, debouncedFrom, debouncedTo])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-text">Transaksi</h1>
        <a href={exportUrl} download>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </a>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); handleFilterChange() }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment Link</label>
            <select
              value={linkFilter}
              onChange={(e) => { setLinkFilter(e.target.value); handleFilterChange() }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Semua link</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Dari tanggal</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); handleFilterChange() }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sampai tanggal</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); handleFilterChange() }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {(statusFilter !== 'all' || linkFilter || fromDate || toDate) && (
          <button
            onClick={() => {
              setStatusFilter('all')
              setLinkFilter('')
              setFromDate('')
              setToDate('')
              setPage(0)
            }}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Reset filter
          </button>
        )}
      </Card>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gray-400">
          {total} transaksi ditemukan
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="Belum ada transaksi"
          description="Transaksi akan muncul di sini setelah pelanggan melakukan pembayaran."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => openTxDetail(tx)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text text-sm">
                      {tx.payer_name || 'Anonim'}
                    </span>
                    {tx.payment_link && (
                      <span className="text-xs text-gray-400">
                        · {tx.payment_link.title}
                      </span>
                    )}
                  </div>
                  {tx.payer_email && (
                    <p className="text-xs text-gray-400 mt-0.5">{tx.payer_email}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(tx.created_at).toLocaleString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-semibold text-primary">
                    {formatRp(tx.amount)}
                  </span>
                  <Badge status={tx.status} />
                  {tx.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        aria-label="Konfirmasi transaksi"
                        onClick={() => handleUpdateStatus(tx.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        aria-label="Tolak transaksi"
                        onClick={() => handleUpdateStatus(tx.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Link href={`/links/${tx.payment_link_id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" aria-label="Buka halaman link">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Halaman {page + 1} dari {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Transaction detail modal */}
      <Modal
        open={selectedTx !== null}
        onClose={() => { setSelectedTx(null); setProofUrl(null) }}
        title="Detail Transaksi"
        className="max-w-lg"
      >
        {selectedTx && (
          <div className="space-y-4">
            {/* Payer info */}
            <div className="rounded-lg bg-gray-50 p-4 space-y-1">
              <p className="font-semibold text-text">{selectedTx.payer_name || 'Anonim'}</p>
              {selectedTx.payer_email && (
                <p className="text-sm text-gray-500">{selectedTx.payer_email}</p>
              )}
            </div>

            {/* Amount & status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Nominal</p>
                <p className="text-xl font-bold text-primary">{formatRp(selectedTx.amount)}</p>
              </div>
              <Badge status={selectedTx.status} />
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Tanggal</p>
              <p className="text-sm text-text">
                {new Date(selectedTx.created_at).toLocaleString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long',
                  year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            {/* Payment link */}
            {selectedTx.payment_link && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Payment Link</p>
                <Link
                  href={`/links/${selectedTx.payment_link_id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  {selectedTx.payment_link.title}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Proof image */}
            {selectedTx.payment_proof && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Bukti Pembayaran</p>
                {proofLoading ? (
                  <div className="h-40 animate-pulse rounded-lg bg-gray-200" />
                ) : proofUrl ? (
                  <button
                    onClick={() => setLightboxUrl(proofUrl)}
                    className="block w-full overflow-hidden rounded-lg border border-gray-100 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={proofUrl}
                      alt="Bukti pembayaran"
                      className="max-h-48 w-full object-contain bg-gray-50"
                    />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <ImageIcon className="h-4 w-4" />
                    Gagal memuat bukti
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {selectedTx.notes && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Catatan</p>
                <p className="text-sm text-text">{selectedTx.notes}</p>
              </div>
            )}

            {/* Actions */}
            {selectedTx.status === 'pending' && (
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedTx.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4" />
                  Tolak
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedTx.id, 'confirmed')}
                >
                  <CheckCircle className="h-4 w-4" />
                  Konfirmasi
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Proof image lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            aria-label="Tutup"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Bukti pembayaran"
            className="max-h-[85vh] max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

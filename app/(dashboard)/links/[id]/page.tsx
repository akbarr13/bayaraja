'use client'

import { useEffect, useState, use } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/links/share-button'
import { formatRp } from '@/lib/utils'
import { ArrowLeft, CheckCircle, XCircle, Image as ImageIcon, Download } from 'lucide-react'
import Link from 'next/link'
import type { PaymentLink, Transaction } from '@/lib/types'

export default function LinkDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [link, setLink] = useState<PaymentLink | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [proofUrl, setProofUrl] = useState<string | null>(null)

  async function loadData() {
    const supabase = getBrowserSupabase()
    const [linkRes, txRes] = await Promise.all([
      supabase
        .from('payment_links')
        .select('*, qris_account:qris_accounts(label)')
        .eq('id', id)
        .single(),
      supabase
        .from('transactions')
        .select('*')
        .eq('payment_link_id', id)
        .order('created_at', { ascending: false }),
    ])
    setLink(linkRes.data)
    setTransactions(txRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [id])

  async function handleUpdateStatus(txId: string, status: 'confirmed' | 'rejected') {
    const supabase = getBrowserSupabase()
    await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', txId)
    await loadData()
  }

  async function viewProof(txId: string) {
    const res = await fetch(`/api/transactions/${txId}/proof`)
    if (res.ok) {
      const data = await res.json()
      setProofUrl(data.url)
    }
  }

  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
  }

  if (!link) {
    return <p className="text-gray-500">Link tidak ditemukan.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/links">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-heading font-bold text-text">{link.title}</h1>
      </div>

      <Card>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-gray-500">Nominal</p>
            <p className="text-xl font-semibold text-primary">{formatRp(link.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Slug</p>
            <p className="font-mono text-sm">/pay/{link.slug}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={link.is_active ? 'text-green-600' : 'text-red-600'}>
              {link.is_active ? 'Aktif' : 'Nonaktif'}
            </p>
          </div>
          <div>
            <ShareButton slug={link.slug} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaksi ({transactions.length})</CardTitle>
            {transactions.length > 0 && (
              <a
                href={`/api/transactions/export?link_id=${id}`}
                download
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </a>
            )}
          </div>
        </CardHeader>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada transaksi.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-gray-100 p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{tx.payer_name || 'Anonim'}</p>
                  {tx.payer_email && (
                    <p className="text-sm text-gray-500">{tx.payer_email}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    {new Date(tx.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="font-semibold">{formatRp(tx.amount)}</p>
                <Badge status={tx.status} />
                <div className="flex gap-2">
                  {tx.payment_proof && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewProof(tx.id)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {tx.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(tx.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(tx.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {proofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setProofUrl(null)}
        >
          <img
            src={proofUrl}
            alt="Bukti pembayaran"
            className="max-h-[80vh] max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

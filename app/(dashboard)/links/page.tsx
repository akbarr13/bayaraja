'use client'

import { useEffect, useMemo, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { LinkForm } from '@/components/links/link-form'
import { LinkCard } from '@/components/links/link-card'
import { useToast } from '@/components/ui/toast'
import { Plus, Link2, Search } from 'lucide-react'
import type { PaymentLink, QrisAccount } from '@/lib/types'

const PAGE_SIZE = 20

export default function LinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [qrisAccounts, setQrisAccounts] = useState<QrisAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const { toast } = useToast()

  async function loadData() {
    const supabase = getBrowserSupabase()
    const [linksRes, qrisRes] = await Promise.all([
      supabase
        .from('payment_links')
        .select('*, qris_account:qris_accounts(label)')
        .order('created_at', { ascending: false }),
      supabase.from('qris_accounts').select('*').order('created_at'),
    ])
    setLinks(linksRes.data ?? [])
    setQrisAccounts(qrisRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchSearch =
        search === '' ||
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        link.slug.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && link.is_active) ||
        (statusFilter === 'inactive' && !link.is_active)
      return matchSearch && matchStatus
    })
  }, [links, search, statusFilter])

  const pagedLinks = useMemo(() => {
    return filteredLinks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  }, [filteredLinks, page])

  const totalPages = Math.ceil(filteredLinks.length / PAGE_SIZE)

  async function handleSubmit(data: {
    qris_account_id: string
    title: string
    description: string
    amount: number
    is_single_use: boolean
    expires_at: string | null
  }) {
    const { nanoid } = await import('nanoid')
    const slug = nanoid(16)

    const supabase = getBrowserSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('payment_links').insert({
      ...data,
      slug,
      user_id: user!.id,
    })
    if (error) throw error

    setShowForm(false)
    await loadData()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const supabase = getBrowserSupabase()
    await supabase.from('payment_links').delete().eq('id', deleteTarget)
    setDeleteTarget(null)
    toast('Payment link berhasil dihapus')
    await loadData()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-heading font-bold text-text">Payment Links</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-text">Payment Links</h1>
        <Button
          onClick={() => setShowForm(true)}
          disabled={qrisAccounts.length === 0}
        >
          <Plus className="h-4 w-4" />
          Buat Link
        </Button>
      </div>

      {qrisAccounts.length === 0 && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
          Anda belum memiliki QRIS account. Tambahkan QRIS terlebih dahulu di halaman QRIS.
        </div>
      )}

      {/* Search & filter */}
      {links.length > 0 && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau slug..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(0) }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      )}

      {filteredLinks.length === 0 ? (
        links.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="Belum ada payment link"
            description="Buat payment link pertama Anda untuk mulai menerima pembayaran."
            action={
              qrisAccounts.length > 0 ? (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4" />
                  Buat Link
                </Button>
              ) : undefined
            }
          />
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">Tidak ada link yang cocok.</p>
        )
      ) : (
        <>
          <div className="space-y-3">
            {pagedLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={() => setDeleteTarget(link.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400">
                {filteredLinks.length} link · halaman {page + 1} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Buat Payment Link"
      >
        <LinkForm
          qrisAccounts={qrisAccounts}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Payment Link"
        description="Payment link ini akan dihapus permanen dan tidak bisa diakses lagi."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

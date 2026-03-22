'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { QrisForm } from '@/components/qris/qris-form'
import { QrisCard } from '@/components/qris/qris-card'
import { Plus, QrCode } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import type { QrisAccount } from '@/lib/types'

export default function QrisPage() {
  const [accounts, setAccounts] = useState<QrisAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<QrisAccount | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { toast } = useToast()

  async function loadAccounts() {
    const supabase = getBrowserSupabase()
    const { data } = await supabase
      .from('qris_accounts')
      .select('*')
      .order('created_at', { ascending: false })
    setAccounts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  async function handleSubmit(data: {
    label: string
    qris_string: string
    merchant_name: string
    is_default: boolean
  }) {
    const res = editing
      ? await fetch(`/api/qris/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      : await fetch('/api/qris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error ?? 'Gagal menyimpan QRIS')
    }

    setShowForm(false)
    setEditing(undefined)
    await loadAccounts()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/qris/${deleteTarget}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      setDeleteTarget(null)
      toast(json.error ?? 'Gagal menghapus QRIS', 'error')
      return
    }
    setDeleteTarget(null)
    toast('QRIS berhasil dihapus')
    await loadAccounts()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-heading font-bold text-text">QRIS Accounts</h1>
        {[1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-text">QRIS Accounts</h1>
        <Button onClick={() => { setEditing(undefined); setShowForm(true) }}>
          <Plus className="h-4 w-4" />
          Tambah QRIS
        </Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="Belum ada QRIS"
          description="Tambahkan QRIS statis dari aplikasi bank Anda untuk mulai membuat payment link."
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Tambah QRIS
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {accounts.map((qris) => (
            <QrisCard
              key={qris.id}
              qris={qris}
              onEdit={() => { setEditing(qris); setShowForm(true) }}
              onDelete={() => setDeleteTarget(qris.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(undefined) }}
        title={editing ? 'Edit QRIS' : 'Tambah QRIS'}
      >
        <QrisForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(undefined) }}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus QRIS"
        description="QRIS ini akan dihapus permanen. Payment link yang menggunakan QRIS ini mungkin tidak berfungsi."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

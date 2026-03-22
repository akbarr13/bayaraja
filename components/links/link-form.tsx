'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import type { QrisAccount } from '@/lib/types'

interface LinkFormProps {
  qrisAccounts: QrisAccount[]
  onSubmit: (data: {
    qris_account_id: string
    title: string
    description: string
    amount: number
    is_single_use: boolean
    expires_at: string | null
  }) => Promise<void>
  onCancel: () => void
}

export function LinkForm({ qrisAccounts, onSubmit, onCancel }: LinkFormProps) {
  const defaultQris = qrisAccounts.find((q) => q.is_default)
  const [qrisAccountId, setQrisAccountId] = useState(defaultQris?.id ?? qrisAccounts[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isSingleUse, setIsSingleUse] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const parsedAmount = parseInt(amount, 10)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Nominal harus angka positif')
      }

      if (expiresAt && new Date(expiresAt) <= new Date()) {
        throw new Error('Tanggal kadaluarsa harus di masa depan')
      }

      await onSubmit({
        qris_account_id: qrisAccountId,
        title,
        description,
        amount: parsedAmount,
        is_single_use: isSingleUse,
        expires_at: expiresAt || null,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="qris_account"
        label="QRIS Account"
        value={qrisAccountId}
        onChange={(e) => setQrisAccountId(e.target.value)}
        required
      >
        {qrisAccounts.map((q) => (
          <option key={q.id} value={q.id}>
            {q.label} {q.is_default ? '(Default)' : ''}
          </option>
        ))}
      </Select>

      <Input
        id="title"
        label="Judul"
        placeholder="Contoh: Invoice #001"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        id="description"
        label="Deskripsi (opsional)"
        placeholder="Keterangan tambahan"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        id="amount"
        label="Nominal (Rp)"
        type="number"
        placeholder="50000"
        min={1}
        max={99999999}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        id="expires_at"
        label="Kadaluarsa (opsional)"
        type="datetime-local"
        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isSingleUse}
          onChange={(e) => setIsSingleUse(e.target.checked)}
          className="rounded border-gray-300"
        />
        Hanya bisa digunakan sekali (single-use)
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          Buat Link
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  )
}

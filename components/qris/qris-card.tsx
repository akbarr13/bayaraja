'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Star, Pencil, Trash2, Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'
import type { QrisAccount } from '@/lib/types'

interface QrisCardProps {
  qris: QrisAccount
  onEdit: () => void
  onDelete: () => void
}

export function QrisCard({ qris, onEdit, onDelete }: QrisCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopyId() {
    await copyToClipboard(qris.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="flex items-start gap-4">
      <div className="rounded-lg bg-primary/10 p-3">
        <QrCode className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text truncate">{qris.label}</h3>
          {qris.is_default && (
            <Star className="h-4 w-4 text-cta fill-cta flex-shrink-0" />
          )}
        </div>
        {qris.merchant_name && (
          <p className="text-sm text-gray-500">{qris.merchant_name}</p>
        )}
        <button
          type="button"
          onClick={handleCopyId}
          className="mt-1 flex items-center gap-1 text-xs text-gray-400 font-mono hover:text-primary transition-colors group"
          title="Klik untuk copy UUID"
        >
          <span className="truncate max-w-[200px]">{qris.id}</span>
          {copied
            ? <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
            : <Copy className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </button>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Star, Pencil, Trash2 } from 'lucide-react'
import type { QrisAccount } from '@/lib/types'

interface QrisCardProps {
  qris: QrisAccount
  onEdit: () => void
  onDelete: () => void
}

export function QrisCard({ qris, onEdit, onDelete }: QrisCardProps) {
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
        <p className="mt-1 text-xs text-gray-400 font-mono truncate">
          {qris.qris_string.slice(0, 40)}...
        </p>
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

'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/links/share-button'
import { formatRp } from '@/lib/utils'
import { ExternalLink, Eye, Trash2 } from 'lucide-react'
import type { PaymentLink } from '@/lib/types'

interface LinkCardProps {
  link: PaymentLink
  onDelete: () => void
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const isExpired = link.expires_at && new Date(link.expires_at) < new Date()
  const status = !link.is_active
    ? 'Nonaktif'
    : isExpired
      ? 'Kadaluarsa'
      : 'Aktif'
  const statusColor = !link.is_active || isExpired
    ? 'text-red-600 bg-red-50'
    : 'text-green-600 bg-green-50'

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text truncate">{link.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-lg font-semibold text-primary mt-1">
          {formatRp(link.amount)}
        </p>
        {link.description && (
          <p className="text-sm text-gray-500 truncate">{link.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1 font-mono">
          /pay/{link.slug}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <ShareButton slug={link.slug} />
        <Link href={`/links/${link.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <a
          href={`/pay/${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </Card>
  )
}

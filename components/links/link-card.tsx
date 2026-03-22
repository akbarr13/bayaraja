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
  onToggle: () => void
  toggling?: boolean
}

export function LinkCard({ link, onDelete, onToggle, toggling }: LinkCardProps) {
  const now = new Date()
  const expiresAt = link.expires_at ? new Date(link.expires_at) : null
  const isExpired = expiresAt && expiresAt < now
  const expiresInDays = expiresAt && !isExpired
    ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null
  const expiringSoon = expiresInDays !== null && expiresInDays <= 3

  const status = !link.is_active
    ? 'Nonaktif'
    : isExpired
      ? 'Kadaluarsa'
      : 'Aktif'
  const statusColor = !link.is_active
    ? 'text-red-600 bg-red-50'
    : isExpired
      ? 'text-amber-600 bg-amber-50'
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
        {expiringSoon && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ Kadaluarsa dalam {expiresInDays} hari
          </p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0 items-center">
        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={link.is_active}
          aria-label={link.is_active ? 'Nonaktifkan link' : 'Aktifkan link'}
          disabled={toggling}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            link.is_active ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
              link.is_active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        <ShareButton slug={link.slug} />
        <Link href={`/links/${link.id}`} aria-label={`Lihat detail ${link.title}`}>
          <Button variant="outline" size="sm" aria-label="Lihat detail">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <a
          href={`/pay/${link.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka halaman bayar ${link.title}`}
        >
          <Button variant="outline" size="sm" aria-label="Buka halaman bayar">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label={`Hapus ${link.title}`}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </Card>
  )
}

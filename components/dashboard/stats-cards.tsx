'use client'

import { Card } from '@/components/ui/card'
import { formatRp } from '@/lib/utils'
import { Link2, QrCode, ArrowUpRight, Clock } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: 'Payment Links',
      value: stats.total_links,
      sub: `${stats.active_links} aktif`,
      icon: Link2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Transaksi',
      value: stats.total_transactions,
      sub: `${stats.pending_transactions} menunggu`,
      icon: QrCode,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Dikonfirmasi',
      value: stats.confirmed_transactions,
      sub: 'transaksi',
      icon: ArrowUpRight,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Revenue',
      value: formatRp(stats.total_revenue),
      sub: 'dikonfirmasi',
      icon: Clock,
      color: 'text-cta',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="flex items-start gap-4">
          <div className={`rounded-lg p-2.5 ${item.bg}`}>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold text-text">{item.value}</p>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

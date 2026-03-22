'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRp } from '@/lib/utils'
import type { TrendPoint } from '@/app/api/stats/trends/route'

function BarChart({
  data,
  valueKey,
  formatValue,
  color,
}: {
  data: TrendPoint[]
  valueKey: 'count' | 'revenue'
  formatValue: (v: number) => string
  color: string
}) {
  const values = data.map((d) => d[valueKey])
  const max = Math.max(...values, 1)
  const chartH = 80

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${data.length * 12} ${chartH + 4}`}
        className="w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const h = Math.max(2, (d[valueKey] / max) * chartH)
          const y = chartH - h + 2
          return (
            <g key={d.date}>
              <rect
                x={i * 12 + 1}
                y={y}
                width={10}
                height={h}
                rx={2}
                fill={color}
                opacity={d[valueKey] === 0 ? 0.15 : 0.85}
              />
              {d[valueKey] > 0 && (
                <title>{`${d.date}: ${formatValue(d[valueKey])}`}</title>
              )}
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-gray-400">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  )
}

export function TrendsChart() {
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats/trends')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalTx = data.reduce((s, d) => s + d.count, 0)
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <div className="h-4 w-32 rounded bg-gray-100 animate-pulse mb-4" />
            <div className="h-20 rounded bg-gray-100 animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold text-gray-400">Belum ada data</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Transaksi — 30 hari</CardTitle>
          <p className="text-2xl font-bold text-text mt-1">{totalTx}</p>
        </CardHeader>
        <BarChart
          data={data}
          valueKey="count"
          formatValue={(v) => `${v} transaksi`}
          color="#2563EB"
        />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pendapatan — 30 hari</CardTitle>
          <p className="text-2xl font-bold text-text mt-1">{formatRp(totalRevenue)}</p>
        </CardHeader>
        <BarChart
          data={data}
          valueKey="revenue"
          formatValue={formatRp}
          color="#F97316"
        />
      </Card>
    </div>
  )
}

'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRp } from '@/lib/utils'
import type { Transaction } from '@/lib/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada transaksi.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 font-medium">Link</th>
                <th className="pb-3 font-medium">Pembayar</th>
                <th className="pb-3 font-medium">Nominal</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50">
                  <td className="py-3">
                    {tx.payment_link?.title ?? '-'}
                  </td>
                  <td className="py-3">{tx.payer_name ?? '-'}</td>
                  <td className="py-3 font-medium">{formatRp(tx.amount)}</td>
                  <td className="py-3">
                    <Badge status={tx.status} />
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

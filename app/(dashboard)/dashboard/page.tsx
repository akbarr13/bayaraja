import { Suspense } from 'react'
import { createSessionSupabase } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { TrendsChart } from '@/components/dashboard/charts'
import { Card } from '@/components/ui/card'
import type { DashboardStats, Transaction } from '@/lib/types'

async function StatsCardsLoader() {
  const supabase = await createSessionSupabase()

  const [
    { count: totalLinks },
    { count: activeLinks },
    { count: totalTx },
    { count: pendingTx },
    { count: confirmedTx },
    { data: revenueRows },
  ] = await Promise.all([
    supabase.from('payment_links').select('*', { count: 'exact', head: true }),
    supabase.from('payment_links').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('transactions').select('amount').eq('status', 'confirmed'),
  ])

  const stats: DashboardStats = {
    total_links: totalLinks ?? 0,
    active_links: activeLinks ?? 0,
    total_transactions: totalTx ?? 0,
    pending_transactions: pendingTx ?? 0,
    confirmed_transactions: confirmedTx ?? 0,
    total_revenue: (revenueRows ?? []).reduce((sum, t) => sum + t.amount, 0),
  }

  return <StatsCards stats={stats} />
}

async function RecentTransactionsLoader() {
  const supabase = await createSessionSupabase()
  const { data } = await supabase
    .from('transactions')
    .select('*, payment_link:payment_links(title)')
    .order('created_at', { ascending: false })
    .limit(10)

  return <RecentTransactions transactions={(data ?? []) as Transaction[]} />
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-7 w-16 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <Card>
      <div className="h-5 w-40 rounded bg-gray-100 animate-pulse mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 flex-1 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text">Dashboard</h1>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCardsLoader />
      </Suspense>
      <TrendsChart />
      <Suspense fallback={<RecentTransactionsSkeleton />}>
        <RecentTransactionsLoader />
      </Suspense>
    </div>
  )
}

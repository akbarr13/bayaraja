'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'

export function usePendingCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getBrowserSupabase()
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count: c }: { count: number | null }) => setCount(c ?? 0))
  }, [])

  return count
}

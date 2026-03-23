'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="text-center max-w-md">
        <p className="text-4xl font-bold text-gray-200 mb-4">500</p>
        <h1 className="text-xl font-heading font-bold text-[#1E293B] mb-2">
          Terjadi kesalahan
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Ada sesuatu yang salah. Coba lagi, atau hubungi kami jika masalah berlanjut.
        </p>
        <Button onClick={reset}>Coba lagi</Button>
      </div>
    </div>
  )
}

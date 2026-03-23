'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
        <div className="text-center max-w-md">
          <p className="text-4xl font-bold text-gray-200 mb-4">500</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Terjadi kesalahan fatal
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Ada sesuatu yang salah pada aplikasi. Coba muat ulang halaman.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  )
}

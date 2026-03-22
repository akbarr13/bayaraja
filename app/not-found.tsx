import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <p className="text-6xl font-heading font-bold text-[#2563EB]">404</p>
      <h1 className="mt-4 text-xl font-heading font-bold text-[#1E293B]">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-gray-500">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Kembali ke beranda
      </Link>
    </div>
  )
}

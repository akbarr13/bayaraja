import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-glow-pulse absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div
            className="animate-glow-pulse absolute top-1/3 right-0 h-[250px] w-[250px] rounded-full bg-orange-500/8 blur-[90px]"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <Link
          href="/"
          className="animate-fade-in relative text-lg font-heading font-bold text-white tracking-tight hover:opacity-80 transition-opacity"
          style={{ animationDelay: '100ms' }}
        >
          Bayaraja
        </Link>
        <div>
          <p
            className="animate-fade-up text-3xl font-heading font-bold text-white leading-snug"
            style={{ animationDelay: '200ms' }}
          >
            QRIS statis Anda,<br />
            <span className="text-[#F97316]">jadi payment link</span><br />
            dalam sekejap.
          </p>
          <p
            className="animate-fade-up mt-4 text-sm text-slate-400 max-w-xs leading-relaxed"
            style={{ animationDelay: '350ms' }}
          >
            Tidak perlu integrasi payment gateway. Cukup tempel QRIS dari bank Anda, buat link, dan share.
          </p>
        </div>
        <p
          className="animate-fade-in relative text-xs text-slate-700"
          style={{ animationDelay: '500ms' }}
        >
          Standar EMV-CO · QRIS Indonesia
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-[#F8FAFC]">
        <div
          className="animate-fade-up w-full max-w-sm"
          style={{ animationDelay: '150ms' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

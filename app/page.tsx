import Link from 'next/link'
import { ArrowRight, Zap, Banknote, Share2, ShieldCheck, Plug, BadgeCheck, X, Check, Github } from 'lucide-react'
import { AnimateIn } from '@/components/ui/animate-in'
import { MobileMenu } from '@/components/landing/mobile-menu'
import { PhoneMockup } from '@/components/landing/phone-mockup'
import { FaqAccordion } from '@/components/landing/faq-accordion'
import { StatsCounter } from '@/components/landing/stats-counter'

const faqItems = [
  {
    q: 'Berapa biaya pakai Bayaraja?',
    a: 'Gratis. Tidak ada biaya pendaftaran, bulanan, atau potongan per transaksi.',
  },
  {
    q: 'Apakah QRIS saya aman?',
    a: 'Ya. QRIS asli Anda tersimpan terenkripsi dan tidak pernah terekspos ke pelanggan maupun pihak lain.',
  },
  {
    q: 'E-wallet apa saja yang bisa dipakai?',
    a: 'Semua yang mendukung QRIS — GoPay, OVO, Dana, ShopeePay, dan mobile banking semua bank.',
  },
  {
    q: 'Pelanggan perlu install aplikasi?',
    a: 'Tidak. Halaman pembayaran terbuka langsung di browser, tanpa install apa pun.',
  },
  {
    q: 'Bisa diintegrasikan dengan sistem toko?',
    a: 'Bisa. Tersedia REST API dengan autentikasi API key untuk toko online atau kasir digital.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Langsung ke konten utama
      </a>

      {/* Sticky Navbar */}
      <header className="animate-fade-in sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
        <nav aria-label="Main navigation" className="relative flex items-center justify-between md:grid md:grid-cols-3 max-w-6xl mx-auto w-full px-4 sm:px-8 h-14 sm:h-18">
          <Link href="/" className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316] shadow-sm shadow-orange-200">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight text-slate-900">
              Bayaraja
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-1">
            <a href="#fitur" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
              Fitur
            </a>
            <a href="#cara-mulai" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
              Cara Mulai
            </a>
            <a href="#faq" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
              FAQ
            </a>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/login" className="hidden md:flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition-colors px-3 py-2.5 rounded-lg min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none">
              Masuk
            </Link>
            <Link
              href="/register"
              className="hidden md:inline-flex items-center rounded-full bg-[#F97316] px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Daftar gratis
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </header>

      <main id="main-content">

      {/* Hero — two-column layout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white px-6 py-16 sm:py-20 lg:py-24">
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <div className="text-center lg:text-left">
            <div
              className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 font-medium"
              style={{ animationDelay: '0ms' }}
            >
              <Zap className="h-3.5 w-3.5 text-orange-500" />
              Gratis, tanpa perlu install aplikasi
            </div>

            <h1
              className="animate-fade-up text-4xl font-heading font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Terima bayaran QRIS{' '}
              <span className="text-[#F97316]">dengan nominal yang pas.</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed lg:mx-0 mx-auto"
              style={{ animationDelay: '160ms' }}
            >
              Buat link tagihan, kirim ke pelanggan, mereka tinggal scan dan bayar. Nominalnya sudah terisi.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F97316] px-7 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-md shadow-orange-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Mulai gratis sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-base font-medium text-slate-700 hover:border-gray-400 hover:text-slate-900 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Sudah punya akun
              </Link>
            </div>

            {/* Trust micro-strip */}
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500"
              style={{ animationDelay: '320ms' }}
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Open-source
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                Gratis selamanya
              </span>
            </div>
          </div>

          {/* Phone mockup column */}
          <div
            className="animate-fade-up hidden sm:flex justify-center lg:justify-end relative"
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
            <div className="animate-float relative max-w-[260px] sm:max-w-[300px]">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-white px-6 py-12 sm:py-14">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatsCounter value="100%" label="Gratis, tanpa biaya tersembunyi" />
          <StatsCounter value="5 menit" label="Dari daftar sampai link pertama aktif" />
          <StatsCounter value="Semua e-wallet" label="GoPay, OVO, Dana, ShopeePay, semua bank" />
          <StatsCounter value="0%" label="Potongan transaksi, dana langsung ke Anda" />
        </div>
      </section>

      {/* Before vs After */}
      <section className="px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Sebelum dan sesudah</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">Bayaraja menggantikan proses yang selama ini merepotkan.</h2>
          </AnimateIn>
          <AnimateIn>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Cara Lama */}
              <div className="rounded-2xl bg-red-50/40 border border-red-100 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-5">Cara lama</p>
                <div className="space-y-4">
                  {[
                    'Pelanggan ketik nominal sendiri',
                    'Minta screenshot bukti bayar via WhatsApp',
                    'Rekap transaksi manual dari chat',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 mt-0.5">
                        <X className="h-3 w-3 text-red-500" />
                      </div>
                      <p className="text-sm text-slate-500">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dengan Bayaraja */}
              <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-5">Dengan Bayaraja</p>
                <div className="space-y-4">
                  {[
                    'Nominal sudah terisi otomatis di QR',
                    'Pelanggan upload bukti di halaman yang sama',
                    'Semua tercatat otomatis di dashboard',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 mt-0.5">
                        <Check className="h-3 w-3 text-orange-500" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="scroll-mt-14 sm:scroll-mt-18 px-6 py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Fitur utama</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">Dirancang supaya proses bayar jadi lebih lancar.</h2>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Banknote,    title: 'Nominal sudah terisi otomatis',    desc: 'QR langsung siap dengan jumlah yang pas, pelanggan tidak perlu ketik apa pun.' },
              { icon: Share2,      title: 'Mudah dibagikan lewat chat',        desc: 'Kirim via WhatsApp, email, atau taruh di invoice. Sekali klik, langsung bayar.' },
              { icon: ShieldCheck, title: 'Data QRIS Anda aman',               desc: 'QRIS asli tidak pernah terekspos. Hanya dipakai di sisi server untuk membuat QR dinamis.' },
              { icon: Plug,        title: 'Bisa diintegrasikan',               desc: 'Tersedia REST API untuk toko online atau kasir digital yang butuh otomatisasi.' },
            ].map((f, i) => (
              <AnimateIn key={f.title} delay={i * 80}>
                <div className="group rounded-2xl border border-gray-100 border-l-2 border-l-transparent hover:border-l-orange-400 bg-gray-50 p-6 hover:border-orange-100 hover:bg-orange-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-gray-100 group-hover:border-orange-100 shadow-sm transition-colors mb-4">
                    <f.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section id="cara-mulai" className="scroll-mt-14 sm:scroll-mt-18 px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Cara mulai</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">
              Tiga langkah sederhana,<br />langsung bisa terima bayaran.
            </h2>
          </AnimateIn>

          {/* Desktop: horizontal 3-col */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] border-t-2 border-dashed border-orange-200" />

            {[
              { n: '1', t: 'Upload QRIS statis Anda', d: 'Buat akun gratis dan upload QRIS dari aplikasi bank atau dompet digital Anda. Cukup sekali.' },
              { n: '2', t: 'Buat dan bagikan link tagihan', d: 'Tulis nama dan nominal, lalu kirim link via WhatsApp, email, atau taruh di invoice.' },
              { n: '3', t: 'Pelanggan scan dan bayar', d: 'QR sudah berisi nominal yang pas. Bisa pakai GoPay, OVO, Dana, atau mobile banking.' },
            ].map((s, i) => (
              <AnimateIn key={s.n} delay={i * 120}>
                <div className="relative text-center">
                  <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white shadow-md shadow-orange-200 relative z-10">
                    {s.n}
                  </div>
                  <h3 className="mt-5 font-semibold text-slate-900">{s.t}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.d}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-orange-100" />
            <div className="space-y-8">
              {[
                { n: '1', t: 'Upload QRIS statis Anda', d: 'Buat akun gratis dan upload QRIS dari aplikasi bank atau dompet digital Anda. Cukup sekali.' },
                { n: '2', t: 'Buat dan bagikan link tagihan', d: 'Tulis nama dan nominal, lalu kirim link via WhatsApp, email, atau taruh di invoice.' },
                { n: '3', t: 'Pelanggan scan dan bayar', d: 'QR sudah berisi nominal yang pas. Bisa pakai GoPay, OVO, Dana, atau mobile banking.' },
              ].map((s, i) => (
                <AnimateIn key={s.n} variant="left" delay={i * 100}>
                  <div className="flex gap-6 pl-14 relative">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white absolute left-0 top-0">
                      {s.n}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-semibold text-slate-900">{s.t}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{s.d}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-14 sm:scroll-mt-18 px-6 py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Pertanyaan umum</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-10">Ada yang ingin ditanyakan?</h2>
          </AnimateIn>
          <AnimateIn>
            <FaqAccordion items={faqItems} />
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
        <AnimateIn className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight text-white">
            Siap mulai?<br />
            <span className="text-[#F97316]">Daftar gratis dan langsung pakai.</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Tidak perlu kartu kredit dan tidak perlu install apa pun.
          </p>
          <p className="mt-2 text-slate-400 text-sm">
            Bergabung dengan merchant lain yang sudah pakai Bayaraja.
          </p>
          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-9 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Buat akun gratis
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateIn>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-heading font-bold text-white">Bayaraja</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Platform link pembayaran QRIS open-source untuk merchant Indonesia. Simpel, aman, dan gratis.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Produk</p>
              <div className="space-y-2.5">
                <Link href="/dashboard/docs" className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded">Dokumentasi API</Link>
                <a href="https://github.com/akbarr13/bayaraja" target="_blank" rel="noopener noreferrer" aria-label="GitHub (buka di tab baru)" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Akun</p>
              <div className="space-y-2.5">
                <Link href="/register" className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded">Daftar gratis</Link>
                <Link href="/login" className="block text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded">Masuk</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Legal</p>
              <div className="space-y-2.5">
                <span className="block text-sm text-slate-500 cursor-default">Syarat & Ketentuan <span className="text-slate-400 text-xs">(segera hadir)</span></span>
                <span className="block text-sm text-slate-500 cursor-default">Kebijakan Privasi <span className="text-slate-400 text-xs">(segera hadir)</span></span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Bayaraja. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

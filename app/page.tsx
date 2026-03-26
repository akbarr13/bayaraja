import Link from 'next/link'
import { ArrowRight, Zap, Banknote, Share2, ShieldCheck, Plug, BadgeCheck, Clock, Wallet, Landmark, X, Check } from 'lucide-react'
import { AnimateIn } from '@/components/ui/animate-in'
import { MobileMenu } from '@/components/landing/mobile-menu'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">

      {/* Above-the-fold wrapper: navbar + hero + stats = 1 viewport */}
      <div className="min-h-dvh flex flex-col">

      {/* Sticky Navbar */}
      <header className="animate-fade-in sticky top-0 z-50 bg-white/80 backdrop-blur-md shrink-0">
        <nav className="relative flex items-center justify-between md:grid md:grid-cols-3 max-w-6xl mx-auto w-full px-4 sm:px-8 h-14 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F97316] shadow-sm shadow-orange-200">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight text-slate-900">
              Bayaraja
            </span>
          </Link>

          {/* Center nav links — hidden on mobile */}
          <div className="hidden md:flex items-center justify-center gap-1">
            <a href="#fitur" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
              Fitur
            </a>
            <a href="#cara-mulai" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
              Cara Mulai
            </a>
            <a href="#faq" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
              FAQ
            </a>
          </div>

          {/* Auth actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="hidden md:inline-flex items-center rounded-full bg-[#F97316] px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200"
            >
              Daftar gratis
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </header>

      {/* Hero — flex-1 fills remaining space */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white px-6 flex-1 flex items-center">
        <div className="relative z-10 max-w-3xl mx-auto text-center w-full py-16">
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 font-medium"
            style={{ animationDelay: '100ms' }}
          >
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            Gratis, tanpa perlu install aplikasi
          </div>

          <h1
            className="animate-fade-up text-4xl font-heading font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl"
            style={{ animationDelay: '200ms' }}
          >
            Terima bayaran QRIS{' '}
            <span className="text-[#F97316]">dengan nominal yang pas.</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed"
            style={{ animationDelay: '350ms' }}
          >
            Buat link tagihan, kirim ke pelanggan, mereka tinggal scan dan bayar. Nominalnya sudah terisi.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: '480ms' }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F97316] px-7 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-md shadow-orange-200"
            >
              Mulai gratis sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-base font-medium text-slate-700 hover:border-gray-400 hover:text-slate-900 transition-colors"
            >
              Sudah punya akun
            </Link>
          </div>
        </div>
      </section>

      {/* Value propositions strip */}
      <section className="border-y border-gray-100 bg-white px-6 py-7 shrink-0">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[
            { icon: BadgeCheck, title: 'Gratis selamanya',            desc: 'Tanpa biaya setup atau potongan transaksi' },
            { icon: Wallet,     title: 'Semua e-wallet diterima',     desc: 'GoPay, OVO, Dana, ShopeePay, semua bank' },
            { icon: Landmark,   title: 'Langsung ke rekening Anda',   desc: 'Dana masuk ke QRIS Anda, tanpa perantara' },
            { icon: Clock,      title: 'Siap dalam 5 menit',          desc: 'Dari daftar sampai link pertama aktif' },
          ].map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-up flex items-start gap-3"
              style={{ animationDelay: `${600 + i * 80}ms` }}
            >
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 mt-0.5">
                <item.icon className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>{/* end above-the-fold wrapper */}

      {/* Before vs After */}
      <section className="px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Sebelum dan sesudah</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-10">Bayaraja menggantikan proses yang selama ini merepotkan.</h2>
          </AnimateIn>
          <AnimateIn>
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-2 border-b border-gray-200">
                <div className="px-3 sm:px-6 py-3 bg-gray-100">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Cara lama</p>
                </div>
                <div className="px-3 sm:px-6 py-3 bg-orange-50">
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">Dengan Bayaraja</p>
                </div>
              </div>
              {/* Rows */}
              {[
                ['Pelanggan ketik nominal sendiri',            'Nominal sudah terisi otomatis di QR'],
                ['Minta screenshot bukti bayar via WhatsApp',  'Pelanggan upload bukti di halaman yang sama'],
                ['Rekap transaksi manual dari chat',           'Semua tercatat otomatis di dashboard'],
              ].map(([before, after], i) => (
                <div key={i} className={`grid grid-cols-2 ${i < 2 ? 'border-b border-gray-100' : ''}`}>
                  <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-start gap-2 sm:gap-3 bg-white">
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-500">{before}</p>
                  </div>
                  <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-start gap-2 sm:gap-3 bg-orange-50/30">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">{after}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="px-6 py-20 bg-white border-t border-gray-100">
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
                <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-orange-100 hover:bg-orange-50/40 transition-colors">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-100 group-hover:border-orange-100 shadow-sm transition-colors mb-4">
                    <f.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-mulai" className="px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Cara mulai</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-14">
              Mulai pakai dalam hitungan menit,<br />dengan lima langkah sederhana.
            </h2>
          </AnimateIn>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Steps */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-orange-100 hidden sm:block" />
              <div className="space-y-8">
                {[
                  { n: '1', t: 'Buat akun gratis',                d: 'Langsung aktif, tanpa kartu kredit.' },
                  { n: '2', t: 'Upload QRIS statis Anda',         d: 'Ambil dari aplikasi bank atau dompet digital. Cukup sekali.' },
                  { n: '3', t: 'Buat link tagihan',               d: 'Tulis nama dan nominalnya. Selesai dalam hitungan detik.' },
                  { n: '4', t: 'Bagikan ke pelanggan',            d: 'Via WhatsApp, email, atau cantumkan di invoice.' },
                  { n: '5', t: 'Pelanggan scan dan bayar',        d: 'QR sudah berisi nominal. Bisa pakai GoPay, OVO, Dana, atau mobile banking.' },
                ].map((s, i) => (
                  <AnimateIn key={s.n} variant="left" delay={i * 100}>
                    <div className="flex gap-6 sm:pl-14 relative">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white sm:absolute sm:left-0 sm:top-0">
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

            {/* Phone mockup */}
            <AnimateIn variant="fade" className="flex justify-center lg:sticky lg:top-24">
              <div className="relative w-full max-w-[300px] rounded-[2.5rem] border-2 border-gray-300 bg-gray-800 shadow-2xl overflow-hidden">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="h-1.5 w-20 rounded-full bg-gray-600" />
                </div>
                <div className="bg-gray-50 mx-2 mb-2 rounded-2xl overflow-hidden">
                  <div className="bg-white border-b border-gray-100 py-2.5 text-center">
                    <span className="text-xs font-bold text-slate-800">Bayaraja</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">1</div>
                        <span className="text-[11px] font-semibold text-slate-700">Scan & Bayar</span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-slate-800">Toko Kopi Nusantara</p>
                        <p className="text-[10px] text-slate-400 mb-2">BCA · Anindita</p>
                        <div className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 mb-3">
                          <span className="text-sm font-bold text-orange-500">Rp 75.000</span>
                        </div>
                        <div className="mx-auto w-28 h-28 rounded-lg border border-gray-100 p-1.5 bg-white">
                          <svg viewBox="0 0 21 21" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                            <rect x="2.5" y="2.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                            <rect x="13" y="1" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                            <rect x="14.5" y="2.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                            <rect x="1" y="13" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                            <rect x="2.5" y="14.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                            {[
                              [9,1],[10,1],[11,1],[9,3],[11,3],[9,5],[10,5],
                              [1,9],[3,9],[5,9],[1,11],[5,11],[1,10],
                              [9,9],[10,9],[11,9],[9,11],[11,11],[10,10],
                              [13,9],[15,9],[17,9],[19,9],[13,11],[15,11],[17,11],
                              [9,13],[11,13],[13,13],[9,15],[13,15],[9,17],[11,17],
                              [15,13],[17,13],[19,13],[15,15],[17,15],[19,15],[15,17],[19,17],
                            ].map(([cx, cy], i) => (
                              <rect key={i} x={cx} y={cy} width="1" height="1" fill="#1e293b"/>
                            ))}
                          </svg>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-2">GoPay, OVO, Dana, semua mobile banking bisa</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">2</div>
                        <span className="text-[11px] font-semibold text-slate-700">Kirim Bukti Bayar</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg py-4 flex flex-col items-center gap-1.5 bg-gray-50">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium">Foto bukti transfer</p>
                        <p className="text-[8px] text-slate-400">JPG atau PNG, maks. 5MB</p>
                      </div>
                      <div className="mt-2 h-6 w-full rounded-lg bg-orange-500 flex items-center justify-center">
                        <span className="text-[9px] font-semibold text-white">Kirim Bukti Pembayaran</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Pertanyaan umum</p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">Ada yang ingin ditanyakan?</h2>
          </AnimateIn>
          <div className="divide-y divide-gray-100">
            {[
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
            ].map((faq, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <div className="py-6 grid sm:grid-cols-[2fr_3fr] gap-3 sm:gap-8">
                  <p className="font-semibold text-slate-900 text-sm leading-snug">{faq.q}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-slate-900">
        <AnimateIn className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight text-white">
            Siap mulai?<br />
            <span className="text-[#F97316]">Daftar gratis dan langsung pakai.</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Tidak perlu kartu kredit dan tidak perlu install apa pun.
          </p>
          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-8 py-3.5 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/30"
          >
            Buat akun gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-heading font-bold text-white">Bayaraja</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Platform link pembayaran QRIS untuk merchant Indonesia. Simpel, aman, dan gratis.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Akun</p>
              <div className="space-y-2.5">
                <Link href="/register" className="block text-sm text-slate-400 hover:text-white transition-colors">Daftar gratis</Link>
                <Link href="/login" className="block text-sm text-slate-400 hover:text-white transition-colors">Masuk</Link>
                <Link href="/dashboard/docs" className="block text-sm text-slate-400 hover:text-white transition-colors">Dokumentasi API</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Legal</p>
              <div className="space-y-2.5">
                <span className="block text-sm text-slate-600">Syarat & Ketentuan</span>
                <span className="block text-sm text-slate-600">Kebijakan Privasi</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-600 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Bayaraja. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

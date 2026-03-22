import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { AnimateIn } from '@/components/ui/animate-in'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-white">

      {/* Hero + Navbar */}
      <section className="relative overflow-hidden px-6 pb-28 pt-8">
        <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none">
          <div className="animate-glow-pulse h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[100px]" />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none hidden sm:block">
          <div className="animate-glow-pulse h-[250px] w-[250px] rounded-full bg-orange-500/10 blur-[80px]"
               style={{ animationDelay: '2s' }} />
        </div>

        {/* Navbar */}
        <nav className="animate-fade-in relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full mb-24">
          <span className="text-lg font-heading font-bold tracking-tight">
            Bayaraja
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Daftar gratis
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1.5 text-sm text-slate-300"
            style={{ animationDelay: '100ms' }}
          >
            <Zap className="h-3.5 w-3.5 text-cta" />
            Gratis · Tanpa install aplikasi
          </div>

          <h1
            className="text-5xl font-heading font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            QRIS dengan harga pas,{' '}
            <span className="text-[#F97316]">tanpa ribet.</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl mx-auto text-lg text-slate-400 leading-relaxed"
            style={{ animationDelay: '350ms' }}
          >
            Buat link pembayaran berisi QR code yang sudah terisi harganya.
            Kirim ke pelanggan — mereka tinggal buka, scan, dan bayar. Tidak perlu ketik nominal sendiri.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: '480ms' }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#F97316] px-7 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Coba sekarang, gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-7 py-3 text-base font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              Sudah punya akun
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="h-px bg-slate-800" />
      </div>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <AnimateIn>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-12">Kenapa Bayaraja</p>
        </AnimateIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              num: '01',
              title: 'Nominalnya sudah terisi',
              desc: 'Pelanggan buka link, QR langsung muncul dengan harga yang tepat. Tidak perlu ketik-ketik sendiri.',
            },
            {
              num: '02',
              title: 'Kirim lewat chat atau media sosial',
              desc: 'Bagikan link via WhatsApp, Instagram, atau tempel di struk. Pelanggan tinggal klik dan bayar.',
            },
            {
              num: '03',
              title: 'QRIS Anda tetap aman',
              desc: 'Data QRIS asli Anda tidak pernah terlihat oleh siapapun — tersimpan aman di server kami.',
            },
            {
              num: '04',
              title: 'Bisa dihubungkan ke sistem lain',
              desc: 'Punya toko online atau kasir digital? Bayaraja bisa diintegrasikan sesuai kebutuhan.',
            },
          ].map((f, i) => (
            <AnimateIn key={f.num} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-600 hover:-translate-y-1 transition-all duration-300">
                <span className="text-xs font-mono text-slate-600">{f.num}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Cara pakai</p>
            <h2 className="text-3xl font-heading font-bold mb-14">
              Dari daftar sampai terima bayaran,<br />lima langkah.
            </h2>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-800 hidden sm:block" />
            <div className="space-y-8">
              {[
                { n: '1', t: 'Daftar akun', d: 'Daftar gratis, tidak perlu kartu kredit.' },
                { n: '2', t: 'Upload QRIS Anda', d: 'Foto QRIS statis dari aplikasi bank Anda. Cukup sekali, bisa dipakai terus.' },
                { n: '3', t: 'Buat link tagihan', d: 'Isi nama tagihan dan nominalnya. Selesai dalam hitungan detik.' },
                { n: '4', t: 'Kirim ke pelanggan', d: 'Bagikan link lewat WhatsApp, Instagram, atau tempel di invoice Anda.' },
                { n: '5', t: 'Pelanggan scan & bayar', d: 'QR terbuka dengan harga yang sudah terisi. Bayar pakai e-wallet atau mobile banking apapun.' },
              ].map((s, i) => (
                <AnimateIn key={s.n} variant="left" delay={i * 100}>
                  <div className="flex gap-6 sm:pl-14 relative">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-sm font-mono text-slate-400 sm:absolute sm:left-0 sm:top-0">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.t}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{s.d}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Tampilan nyata</p>
            <h2 className="text-3xl font-heading font-bold">
              Begini yang pelanggan Anda lihat.
            </h2>
            <p className="mt-3 text-slate-400 text-sm">Setiap link punya halaman seperti ini — tinggal scan, langsung bayar.</p>
          </AnimateIn>

          <AnimateIn>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">

              {/* Phone mockup */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none">
                  <div className="h-64 w-64 rounded-full bg-orange-500/10 blur-[60px]" />
                </div>

                <div className="relative w-[300px] rounded-[2.5rem] border-2 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1.5 w-20 rounded-full bg-slate-700" />
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
                          <p className="text-[9px] text-slate-400 mt-2">GoPay, OVO, Dana, mobile banking — semua bisa</p>
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
                          <p className="text-[8px] text-slate-400">JPG, PNG — maks. 5MB</p>
                        </div>
                        <div className="mt-2 h-6 w-full rounded-lg bg-orange-500 flex items-center justify-center">
                          <span className="text-[9px] font-semibold text-white">Kirim Bukti Pembayaran</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature callouts */}
              <div className="space-y-6 max-w-sm">
                {[
                  {
                    step: '01',
                    title: 'Harga sudah terisi, pelanggan tinggal scan',
                    desc: 'Tidak perlu minta pelanggan ketik nominal sendiri. Buka link, QR langsung muncul dengan harga yang benar.',
                  },
                  {
                    step: '02',
                    title: 'Bukti bayar dikirim di halaman yang sama',
                    desc: 'Tidak perlu minta screenshot via WhatsApp. Pelanggan upload langsung dari halaman pembayaran.',
                  },
                  {
                    step: '03',
                    title: 'Anda konfirmasi dari satu tempat',
                    desc: 'Semua bukti bayar masuk ke dashboard. Cek, klik konfirmasi — selesai.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-xs font-mono text-slate-600 mt-0.5 flex-shrink-0 w-6">{item.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-slate-800">
        <AnimateIn className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold leading-tight">
            Mau coba?<br />
            <span className="text-[#F97316]">Daftar gratis, langsung pakai.</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Tidak perlu kartu kredit. Tidak perlu install apa-apa.
          </p>
          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-8 py-3.5 text-base font-semibold text-white hover:bg-orange-500 transition-colors"
          >
            Buat akun gratis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-heading font-bold text-white">Bayaraja</span>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Bayaraja. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

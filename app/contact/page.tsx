import type { Metadata } from 'next'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { ContactContent } from '@/components/landing/contact-content'
import { WhatsappFab } from '@/components/landing/whatsapp-fab'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Ada pertanyaan? Hubungi tim Bayaraja melalui email, GitHub, atau kirim pesan langsung.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Langsung ke konten utama
      </a>
      <Navbar isLandingPage={false} />
      <ContactContent />
      <Footer />
      <WhatsappFab />
    </div>
  )
}

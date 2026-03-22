import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Bayaraja — Payment Link Generator dengan QRIS',
    template: '%s | Bayaraja',
  },
  description:
    'Buat payment link dengan QRIS custom amount. Share link, customer scan, bayar langsung.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Bayaraja — Payment Link Generator dengan QRIS',
    description:
      'Buat payment link dengan QRIS custom amount. Share link, customer scan, bayar langsung.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  )
}

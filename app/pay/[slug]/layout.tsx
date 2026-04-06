import { createServerSupabase } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const sb = createServerSupabase()

  const { data: link } = await sb
    .from('payment_links')
    .select('title, amount, description, qris_account:qris_accounts(merchant_name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!link) {
    return {
      title: 'Link Tidak Tersedia — Bayaraja',
    }
  }

  const qrisAccount = link.qris_account as unknown as { merchant_name: string | null } | null
  const merchantName = qrisAccount?.merchant_name ?? null
  const pageTitle = merchantName ? `Bayar ke ${merchantName}` : link.title
  const description = link.description
    ?? `Pembayaran ${link.title} sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(link.amount)}`

  const ogParams = new URLSearchParams({
    title: link.title,
    amount: String(link.amount),
    ...(merchantName ? { merchant: merchantName } : {}),
  })
  const ogImageUrl = `/api/og?${ogParams}`

  return {
    title: `${pageTitle} — Bayaraja`,
    description,
    openGraph: {
      title: pageTitle,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: pageTitle }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
  }
}

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

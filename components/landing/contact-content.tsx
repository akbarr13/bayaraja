'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/ui/animate-in'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/lib/i18n/locale-context'

export function ContactContent() {
  const { t } = useLocale()

  const contactCards = [
    {
      icon: Mail,
      title: t('contact.emailTitle'),
      desc: t('contact.emailDesc'),
      href: 'mailto:support@bayaraja.arwebs.my.id',
      label: 'support@bayaraja.arwebs.my.id',
      external: false,
    },
    {
      icon: MessageCircle,
      title: t('contact.whatsappTitle'),
      desc: t('contact.whatsappDesc'),
      href: 'https://wa.me/628970036939',
      label: '+62 897-0036-939',
      external: true,
    },
  ]

  function buildMailtoHref(name: string, email: string, subject: string, message: string) {
    const body = `Nama: ${name}\nEmail: ${email}\n\n${message}`
    return `mailto:support@bayaraja.arwebs.my.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = (data.get('name') as string) ?? ''
    const email = (data.get('email') as string) ?? ''
    const subject = (data.get('subject') as string) ?? ''
    const message = (data.get('message') as string) ?? ''
    window.location.href = buildMailtoHref(name, email, subject, message)
  }

  return (
    <main id="main-content" className="flex-1 bg-white">

      {/* Header section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white px-6 py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('contact.backHome')}
            </Link>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              {t('contact.sectionLabel')}
            </p>
            <h1 className="text-4xl font-heading font-bold leading-tight text-slate-900 sm:text-5xl mb-4">
              {t('contact.heading')}
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              {t('contact.subheading')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-6 py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {contactCards.map((card, i) => (
              <AnimateIn key={card.title} delay={i * 80}>
                <a
                  href={card.href}
                  target={card.external ? '_blank' : undefined}
                  rel={card.external ? 'noopener noreferrer' : undefined}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 hover:border-orange-100 hover:bg-orange-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 group-hover:border-orange-100 shadow-sm transition-colors">
                    <card.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                  </div>
                  <span className="mt-auto text-sm font-medium text-orange-600 group-hover:text-orange-700 inline-flex items-center gap-1 break-all">
                    {card.label}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-8">
              {t('contact.formHeading')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  id="name"
                  name="name"
                  label={t('contact.formName')}
                  placeholder={t('contact.formNamePlaceholder')}
                  required
                  autoComplete="name"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={t('contact.formEmail')}
                  placeholder={t('contact.formEmailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
              <Input
                id="subject"
                name="subject"
                label={t('contact.formSubject')}
                placeholder={t('contact.formSubjectPlaceholder')}
                required
              />
              <Textarea
                id="message"
                name="message"
                label={t('contact.formMessage')}
                placeholder={t('contact.formMessagePlaceholder')}
                required
                className="min-h-[140px]"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F97316] px-7 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-md shadow-orange-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t('contact.formSubmit')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </AnimateIn>
        </div>
      </section>

    </main>
  )
}

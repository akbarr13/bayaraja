'use client'

import Link from 'next/link'
import { ArrowRight, Banknote, Share2, ShieldCheck, Plug, BadgeCheck, X, Check } from 'lucide-react'
import { AnimateIn } from '@/components/ui/animate-in'
import { PhoneMockup } from '@/components/landing/phone-mockup'
import { FaqAccordion } from '@/components/landing/faq-accordion'
import { StatsCounter } from '@/components/landing/stats-counter'
import { useLocale } from '@/lib/i18n/locale-context'

export function LandingContent() {
  const { t } = useLocale()

  const faqItems = [
    { q: t('faq.items.0.q'), a: t('faq.items.0.a') },
    { q: t('faq.items.1.q'), a: t('faq.items.1.a') },
    { q: t('faq.items.2.q'), a: t('faq.items.2.a') },
    { q: t('faq.items.3.q'), a: t('faq.items.3.a') },
    { q: t('faq.items.4.q'), a: t('faq.items.4.a') },
  ]

  const features = [
    { icon: Banknote,    title: t('features.0.title'), desc: t('features.0.desc') },
    { icon: Share2,      title: t('features.1.title'), desc: t('features.1.desc') },
    { icon: ShieldCheck, title: t('features.2.title'), desc: t('features.2.desc') },
    { icon: Plug,        title: t('features.3.title'), desc: t('features.3.desc') },
  ]

  const steps = [
    { n: '1', t: t('steps.0.title'), d: t('steps.0.desc') },
    { n: '2', t: t('steps.1.title'), d: t('steps.1.desc') },
    { n: '3', t: t('steps.2.title'), d: t('steps.2.desc') },
  ]

  return (
    <main id="main-content">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white px-6 py-16 sm:py-20 lg:py-24">
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div
              className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm text-orange-700 font-medium"
              style={{ animationDelay: '0ms' }}
            >
              <span className="h-3.5 w-3.5 text-orange-500">⚡</span>
              {t('hero.badge')}
            </div>

            <h1
              className="animate-fade-up text-4xl font-heading font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              {t('hero.title')}{' '}
              <span className="text-[#F97316]">{t('hero.titleHighlight')}</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed lg:mx-0 mx-auto"
              style={{ animationDelay: '160ms' }}
            >
              {t('hero.desc')}
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F97316] px-7 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-md shadow-orange-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-base font-medium text-slate-700 hover:border-gray-400 hover:text-slate-900 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500"
              style={{ animationDelay: '320ms' }}
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                {t('hero.trustOpenSource')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                {t('hero.trustFree')}
              </span>
            </div>
          </div>

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
          <StatsCounter value={t('stats.0.value')} label={t('stats.0.label')} />
          <StatsCounter value={t('stats.1.value')} label={t('stats.1.label')} />
          <StatsCounter value={t('stats.2.value')} label={t('stats.2.label')} />
          <StatsCounter value={t('stats.3.value')} label={t('stats.3.label')} />
        </div>
      </section>

      {/* Before vs After */}
      <section className="px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              {t('compare.sectionLabel')}
            </p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">
              {t('compare.heading')}
            </h2>
          </AnimateIn>
          <AnimateIn>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl bg-red-50/40 border border-red-100 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-5">
                  {t('compare.oldLabel')}
                </p>
                <div className="space-y-4">
                  {([0, 1, 2] as const).map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 mt-0.5">
                        <X className="h-3 w-3 text-red-500" />
                      </div>
                      <p className="text-sm text-slate-500">{t(`compare.old.${i}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-5">
                  {t('compare.newLabel')}
                </p>
                <div className="space-y-4">
                  {([0, 1, 2] as const).map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 mt-0.5">
                        <Check className="h-3 w-3 text-orange-500" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{t(`compare.new.${i}`)}</p>
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
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              {t('features.sectionLabel')}
            </p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">
              {t('features.heading')}
            </h2>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
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

      {/* How it works */}
      <section id="cara-mulai" className="scroll-mt-14 sm:scroll-mt-18 px-6 py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              {t('steps.sectionLabel')}
            </p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">
              {t('steps.heading').split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
          </AnimateIn>

          {/* Desktop: horizontal 3-col */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 relative">
            <div className="absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] border-t-2 border-dashed border-orange-200" />
            {steps.map((s, i) => (
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
              {steps.map((s, i) => (
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
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              {t('faq.sectionLabel')}
            </p>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-10">
              {t('faq.heading')}
            </h2>
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
            {t('cta.heading')}<br />
            <span className="text-[#F97316]">{t('cta.headingHighlight')}</span>
          </h2>
          <p className="mt-4 text-slate-400">{t('cta.sub')}</p>
          <p className="mt-2 text-slate-400 text-sm">{t('cta.sub2')}</p>
          <Link
            href="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-9 py-4 text-lg font-semibold text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('cta.button')}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateIn>
      </section>

    </main>
  )
}

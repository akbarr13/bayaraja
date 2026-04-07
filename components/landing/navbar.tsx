'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { useLocale } from '@/lib/i18n/locale-context'
import { LanguageSwitcher } from './language-switcher'
import { MobileMenu } from './mobile-menu'

interface NavbarProps {
  isLandingPage?: boolean
}

export function Navbar({ isLandingPage = true }: NavbarProps) {
  const { t } = useLocale()
  const prefix = isLandingPage ? '' : '/'

  const anchorClass =
    'px-5 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-xl transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none'

  return (
    <header className="animate-fade-in sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
      <nav
        aria-label="Main navigation"
        className="relative flex items-center w-full px-6 sm:px-12 h-20"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded-xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316] shadow-md shadow-orange-200">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-slate-900">
            Bayaraja
          </span>
        </Link>

        {/* Section anchors — absolutely centered */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          <a href={`${prefix}#fitur`} className={anchorClass}>{t('nav.features')}</a>
          <a href={`${prefix}#cara-mulai`} className={anchorClass}>{t('nav.howToStart')}</a>
          <a href={`${prefix}#faq`} className={anchorClass}>{t('nav.faq')}</a>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
          <Link href="/contact" className={anchorClass}>
            {t('nav.contact')}
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <LanguageSwitcher />
          <Link
            href="/login"
            className="px-5 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-xl transition-colors whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          >
            {t('nav.login')}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-full bg-[#F97316] px-6 py-3 text-base font-semibold text-white hover:bg-orange-500 transition-colors shadow-md shadow-orange-200 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('nav.register')}
          </Link>
        </div>

        {/* Mobile: lang switcher + hamburger */}
        <div className="lg:hidden flex items-center gap-3 ml-auto">
          <LanguageSwitcher />
          <MobileMenu isLandingPage={isLandingPage} />
        </div>
      </nav>
    </header>
  )
}

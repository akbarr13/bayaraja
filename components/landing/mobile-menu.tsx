'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-1">
          <a
            href="#fitur"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Fitur
          </a>
          <a
            href="#cara-mulai"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cara Mulai
          </a>
          <a
            href="#faq"
            onClick={() => setOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            FAQ
          </a>
          <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Daftar gratis
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

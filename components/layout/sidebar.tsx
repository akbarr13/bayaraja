'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, QrCode, Link2, Settings, LogOut, BookOpen } from 'lucide-react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/qris', label: 'QRIS', icon: QrCode },
  { href: '/links', label: 'Payment Links', icon: Link2 },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
  { href: '/docs', label: 'API Docs', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col bg-[#0F172A]">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard" className="text-base font-heading font-bold text-white tracking-tight">
          Bayaraja
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              )}
            >
              <item.icon className={cn('h-4 w-4', isActive ? 'text-[#F97316]' : '')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}

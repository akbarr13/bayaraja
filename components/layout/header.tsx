'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden cursor-pointer transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  )
}

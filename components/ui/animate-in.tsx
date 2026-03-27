'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  /** 'up' = fade + slide up, 'left' = fade + slide left, 'fade' = fade only */
  variant?: 'up' | 'left' | 'fade'
  delay?: number
  threshold?: number
}

export function AnimateIn({
  children,
  className,
  variant = 'up',
  delay = 0,
  threshold = 0.05,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Fallback: show after 600ms in case observer never fires
    const fallback = setTimeout(() => setVisible(true), 600 + delay)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback)
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [threshold, delay])

  const revealClass =
    variant === 'left' ? 'reveal-left' : variant === 'fade' ? 'reveal-fade' : 'reveal'

  return (
    <div
      ref={ref}
      className={cn(revealClass, visible && 'is-visible', className)}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

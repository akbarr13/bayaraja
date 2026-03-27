'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StatsCounterProps {
  value: string
  label: string
  className?: string
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function StatsCounter({ value, label, className }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()

          if (prefersReducedMotion) {
            setDisplayValue(value)
            return
          }

          // Parse numeric portion
          const match = value.match(/^(\d+)(.*)$/)
          if (!match) {
            setDisplayValue(value)
            return
          }

          const target = parseInt(match[1], 10)
          const suffix = match[2]

          // Skip counting animation for small numbers (barely noticeable)
          if (target < 10) {
            setDisplayValue(value)
            return
          }

          const duration = 800
          const start = performance.now()

          function animate(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const current = Math.round(easeOutExpo(progress) * target)
            setDisplayValue(`${current}${suffix}`)
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      className={cn(
        'text-center transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <p className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
        {displayValue}
      </p>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">{label}</p>
    </div>
  )
}

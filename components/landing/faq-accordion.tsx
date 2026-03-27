'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqAccordionProps {
  items: { q: string; a: string }[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-gray-100">
      {items.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              className="w-full flex items-center justify-between py-5 text-left min-h-[44px] cursor-pointer group focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded-lg"
            >
              <span className="font-semibold text-slate-900 text-sm pr-4 group-hover:text-orange-600 transition-colors">
                {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180 text-orange-500'
                )}
              />
            </button>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className={cn(
                'grid transition-all duration-200 ease-out',
                isOpen ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-slate-600 leading-relaxed pb-5">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

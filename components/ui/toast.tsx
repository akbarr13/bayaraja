'use client'

import { createContext, useContext, useReducer, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

type Action = { type: 'ADD'; toast: ToastItem } | { type: 'REMOVE'; id: string }

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  if (action.type === 'ADD') return [...state, action.toast]
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id)
  return state
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Math.random().toString(36).slice(2)
    dispatch({ type: 'ADD', toast: { id, message, variant } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <SingleToast
            key={t.id}
            toast={t}
            onRemove={() => dispatch({ type: 'REMOVE', id: t.id })}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function SingleToast({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />,
    error: <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
    info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />,
  }

  const styles = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-md',
        styles[toast.variant]
      )}
    >
      {icons[toast.variant]}
      <p className="flex-1 text-sm text-gray-800">{toast.message}</p>
      <button onClick={onRemove} className="rounded p-0.5 text-gray-400 hover:text-gray-600">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

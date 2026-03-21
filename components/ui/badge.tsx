import { cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/lib/constants'

interface BadgeProps {
  status: string
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const config = STATUS_LABELS[status] ?? {
    label: status,
    color: 'bg-gray-100 text-gray-800',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}

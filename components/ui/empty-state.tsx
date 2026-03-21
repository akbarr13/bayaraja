import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
      <Icon className="mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-1 text-lg font-medium text-text">{title}</h3>
      <p className="mb-4 text-sm text-gray-500">{description}</p>
      {action}
    </div>
  )
}

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  icon?: string
  variant?: 'default' | 'tip' | 'warning' | 'danger' | 'success'
}

const variantStyles = {
  default: 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-dark-700',
  tip: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
}

const titleStyles = {
  default: 'text-slate-900 dark:text-slate-100',
  tip: 'text-blue-900 dark:text-blue-300',
  warning: 'text-yellow-900 dark:text-yellow-300',
  danger: 'text-red-900 dark:text-red-300',
  success: 'text-green-900 dark:text-green-300',
}

export default function Card({
  children,
  title,
  icon,
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={`rounded-lg border p-4 my-4 ${variantStyles[variant]}`}
    >
      {title && (
        <h4 className={`font-semibold mb-2 flex items-center gap-2 ${titleStyles[variant]}`}>
          {icon && <span>{icon}</span>}
          {title}
        </h4>
      )}
      <div className="text-sm">{children}</div>
    </div>
  )
}

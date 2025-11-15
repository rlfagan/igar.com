import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-900 text-white',
        secondary: 'bg-neutral-100 text-primary-800 border border-neutral-200',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        error: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-sky-50 text-sky-700 border border-sky-200',

        // Risk levels
        'risk-critical': 'bg-red-50 text-red-700 border border-red-300 font-semibold',
        'risk-high': 'bg-orange-50 text-orange-700 border border-orange-300 font-semibold',
        'risk-medium': 'bg-amber-50 text-amber-700 border border-amber-300',
        'risk-low': 'bg-emerald-50 text-emerald-700 border border-emerald-300',
        'risk-minimal': 'bg-teal-50 text-teal-700 border border-teal-300',

        // Compliance statuses
        'compliance-pass': 'bg-emerald-50 text-emerald-700 border border-emerald-300',
        'compliance-pending': 'bg-indigo-50 text-indigo-700 border border-indigo-300',
        'compliance-warning': 'bg-amber-50 text-amber-700 border border-amber-300',
        'compliance-fail': 'bg-red-50 text-red-700 border border-red-300',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }

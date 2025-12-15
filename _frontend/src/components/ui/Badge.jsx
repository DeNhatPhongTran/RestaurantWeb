import React from 'react'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-secondary-100 text-secondary-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        danger: 'bg-danger-100 text-danger-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Badge = React.forwardRef(({ className, variant, children, ...props }, ref) => (
  <span className={clsx(badgeVariants({ variant }), className)} ref={ref} {...props}>
    {children}
  </span>
))

Badge.displayName = 'Badge'

export { Badge, badgeVariants }

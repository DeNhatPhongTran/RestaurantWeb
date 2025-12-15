import React from 'react'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus-visible:ring-secondary-500',
        outline: 'border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus-visible:ring-primary-500',
        ghost: 'text-secondary-700 hover:bg-secondary-100 focus-visible:ring-primary-500',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
        success: 'bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => (
    <button
      className={clsx(buttonVariants({ variant, size, fullWidth }), className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export { Button, buttonVariants }

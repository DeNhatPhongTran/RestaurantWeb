import React from 'react'
import clsx from 'clsx'

const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <select
      className={clsx(
        'w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-base',
        'placeholder:text-secondary-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-transparent',
        'disabled:bg-secondary-100 disabled:text-secondary-500 disabled:cursor-not-allowed',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
)

Select.displayName = 'Select'

export { Select }

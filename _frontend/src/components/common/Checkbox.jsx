import React from 'react'
import clsx from 'clsx'

const Checkbox = React.forwardRef(
  ({ className, checked, onChange, label, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={clsx(
          'h-4 w-4 rounded border border-secondary-300 cursor-pointer',
          'checked:bg-primary-500 checked:border-primary-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
          className
        )}
        {...props}
      />
      {label && <label className="text-sm text-secondary-700 cursor-pointer">{label}</label>}
    </div>
  )
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

import React from 'react'
import clsx from 'clsx'

const Label = React.forwardRef(({ className, children, required, ...props }, ref) => (
  <label
    className={clsx('text-sm font-medium text-secondary-700 block mb-2', className)}
    ref={ref}
    {...props}
  >
    {children}
    {required && <span className="text-danger-500 ml-1">*</span>}
  </label>
))

Label.displayName = 'Label'

export { Label }

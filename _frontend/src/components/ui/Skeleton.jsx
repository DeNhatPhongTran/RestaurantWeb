import React from 'react'
import clsx from 'clsx'

const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={clsx('animate-pulse bg-secondary-200 rounded-md', className)}
    ref={ref}
    {...props}
  />
))

Skeleton.displayName = 'Skeleton'

export { Skeleton }

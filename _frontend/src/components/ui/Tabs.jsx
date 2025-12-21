import React from 'react'
import clsx from 'clsx'

const Tabs = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('', className)} ref={ref} {...props}>
    {children}
  </div>
))

Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    className={clsx(
      'flex border-b border-secondary-200 overflow-x-auto',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
))

TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef(
  ({ className, isActive, children, ...props }, ref) => (
    <button
      className={clsx(
        'px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
        'border-b-2 border-transparent',
        isActive
          ? 'text-primary-600 border-b-primary-600'
          : 'text-secondary-600 hover:text-secondary-700'
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
)

TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('', className)} ref={ref} {...props}>
    {children}
  </div>
))

TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }

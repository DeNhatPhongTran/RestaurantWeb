import clsx from 'clsx'
import React from 'react'

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    className={clsx(
      'rounded-lg border border-secondary-200 bg-white shadow-card hover:shadow-card-hover transition-shadow duration-200',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
))

Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('border-b border-secondary-200 px-6 py-4', className)} ref={ref} {...props}>
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

const CardBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('px-1 py-2', className)} ref={ref} {...props}>
    {children}
  </div>
))

CardBody.displayName = 'CardBody'

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('border-t border-secondary-200 px-6 py-4', className)} ref={ref} {...props}>
    {children}
  </div>
))

CardFooter.displayName = 'CardFooter'

export { Card, CardBody, CardFooter, CardHeader }


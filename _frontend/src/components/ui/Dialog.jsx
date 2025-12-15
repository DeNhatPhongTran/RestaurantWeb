import clsx from 'clsx'
import React from 'react'

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {children}
      </div>
    </>
  )
}

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    className={clsx(
      'w-full max-w-md rounded-lg bg-white shadow-lg',
      'transition-all duration-200 ease-out',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
))

DialogContent.displayName = 'DialogContent'

const DialogHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('border-b border-secondary-200 px-6 py-4', className)} ref={ref} {...props}>
    {children}
  </div>
))

DialogHeader.displayName = 'DialogHeader'

const DialogBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('px-6 py-4', className)} ref={ref} {...props}>
    {children}
  </div>
))

DialogBody.displayName = 'DialogBody'

const DialogFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className={clsx('border-t border-secondary-200 px-6 py-4 flex gap-2 justify-end', className)} ref={ref} {...props}>
    {children}
  </div>
))

DialogFooter.displayName = 'DialogFooter'

export { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader }


import React from 'react'

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={
        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-white hover:opacity-95 ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

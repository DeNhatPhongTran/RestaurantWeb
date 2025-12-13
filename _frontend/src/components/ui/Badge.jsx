import React from 'react'

export function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = {
    default: 'bg-primary text-white',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-800'
  }[variant]
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}>{children}</span>
}

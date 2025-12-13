import React from 'react'

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
}

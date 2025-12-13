import React from 'react'

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl p-4 shadow-sm ${className}`}>{children}</div>
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-semibold text-lg ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
}

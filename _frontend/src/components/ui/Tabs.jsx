import React, { useState } from 'react'

export function Tabs({ children, defaultValue, className = '' }) {
  const [active, setActive] = useState(defaultValue)
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  )
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`flex gap-2 mb-6 flex-wrap ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, active, setActive, className = '' }) {
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
        active === value
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, active, className = '' }) {
  return active === value ? <div className={className}>{children}</div> : null
}

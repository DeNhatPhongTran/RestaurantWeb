import React from 'react'

/**
 * Reusable empty state component for displaying when no items are present
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component to display
 * @param {string} props.message - Main message text
 * @param {string} [props.submessage] - Optional secondary message text
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.action] - Optional action button or element
 */
const EmptyState = ({ icon: Icon, message, submessage, className = '', action }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-8 ${className}`}>
      {Icon && <Icon className="h-12 w-12 text-secondary-300 mb-3" />}
      <p className="text-sm text-secondary-500 font-medium mb-1">{message}</p>
      {submessage && <p className="text-xs text-secondary-400 mb-4">{submessage}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState

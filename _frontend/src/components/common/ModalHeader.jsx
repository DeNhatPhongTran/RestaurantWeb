import { X } from 'lucide-react'
import React from 'react'

/**
 * Reusable modal header component with title, optional icon, and close button
 * @param {Object} props
 * @param {string} props.title - Header title text
 * @param {React.ComponentType} [props.icon] - Optional Lucide icon component
 * @param {Function} props.onClose - Close button click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const ModalHeader = ({ title, icon: Icon, onClose, className = '' }) => {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-secondary-200 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-secondary-900" />}
        <h2 className="text-lg font-bold text-secondary-900">{title}</h2>
      </div>
      <button
        onClick={onClose}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary-900 text-white hover:bg-secondary-800 transition-colors"
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ModalHeader

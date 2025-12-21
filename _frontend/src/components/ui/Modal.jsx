import { X } from 'lucide-react'
import React, { useEffect } from 'react'

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-t-2xl shadow-2xl w-full h-[95vh] overflow-hidden animate-slide-up flex flex-col"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <X className="h-5 w-5 text-secondary-600" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

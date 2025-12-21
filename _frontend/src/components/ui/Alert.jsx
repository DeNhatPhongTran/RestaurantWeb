import React from 'react'

const Alert = React.forwardRef(
  ({ variant = 'info', title, description, action, onClose, className }, ref) => {
    const variantClasses = {
      info: 'bg-primary-50 border-primary-200 text-primary-800',
      success: 'bg-success-50 border-success-200 text-success-800',
      warning: 'bg-warning-100 border-warning-200 text-warning-800',
      danger: 'bg-danger-50 border-danger-200 text-danger-800',
    }

    return (
      <div
        className={`${variantClasses[variant]} border rounded-lg p-4 flex justify-between items-start ${className}`}
        ref={ref}
      >
        <div className="flex-1">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </div>
        {action && <div className="ml-4">{action}</div>}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-lg font-semibold opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }

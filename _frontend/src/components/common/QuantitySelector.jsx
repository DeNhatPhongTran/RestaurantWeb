import { Minus, Plus } from 'lucide-react'
import React from 'react'

/**
 * Reusable quantity selector component with increment/decrement buttons
 * @param {Object} props
 * @param {number} props.value - Current quantity value
 * @param {Function} props.onChange - Handler called with new value
 * @param {number} [props.min=0] - Minimum allowed value
 * @param {number} [props.max=Infinity] - Maximum allowed value
 * @param {string} [props.size='default'] - Size variant: 'sm', 'default', 'lg'
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled=false] - Disable the component
 */
const QuantitySelector = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  size = 'default',
  className = '',
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (value > min && !disabled) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max && !disabled) {
      onChange(value + 1)
    }
  }

  const sizeClasses = {
    sm: {
      container: 'gap-2 p-2',
      button: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-lg',
    },
    default: {
      container: 'gap-3 p-3',
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
      text: 'text-2xl',
    },
    lg: {
      container: 'gap-4 p-4',
      button: 'h-12 w-12',
      icon: 'h-6 w-6',
      text: 'text-3xl',
    },
  }

  const sizes = sizeClasses[size] || sizeClasses.default

  return (
    <div
      className={`flex items-center bg-secondary-50 rounded-xl ${sizes.container} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className={`${sizes.button} flex items-center justify-center rounded-lg bg-white border-2 border-secondary-300 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus className={`${sizes.icon} text-secondary-700`} />
      </button>
      <div className="flex-1 text-center">
        <span className={`${sizes.text} font-bold text-secondary-900`}>{value}</span>
      </div>
      <button
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={`${sizes.button} flex items-center justify-center rounded-lg bg-white border-2 border-secondary-300 hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus className={`${sizes.icon} text-secondary-700`} />
      </button>
    </div>
  )
}

export default QuantitySelector

import React from 'react'
import { formatCurrency } from '../../utils/formatters'

/**
 * Reusable price summary component showing subtotal, tax, and total
 * @param {Object} props
 * @param {number} props.subtotal - Subtotal amount before tax
 * @param {number} props.tax - Tax amount
 * @param {number} props.total - Total amount including tax
 * @param {string} [props.size='default'] - Size variant: 'sm', 'default', 'lg'
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showLabels=true] - Whether to show labels (Tạm Tính, Thuế, etc.)
 */
const PriceSummary = ({
  subtotal,
  tax,
  total,
  size = 'default',
  className = '',
  showLabels = true,
}) => {
  const sizeClasses = {
    sm: {
      container: 'space-y-1',
      row: 'text-xs',
      total: 'text-sm',
      totalAmount: 'text-base',
    },
    default: {
      container: 'space-y-1.5',
      row: 'text-sm',
      total: 'text-base',
      totalAmount: 'text-lg',
    },
    lg: {
      container: 'space-y-2',
      row: 'text-base',
      total: 'text-lg',
      totalAmount: 'text-xl',
    },
  }

  const sizes = sizeClasses[size] || sizeClasses.default

  return (
    <div className={`${sizes.container} ${className}`}>
      <div className={`flex items-center justify-between ${sizes.row}`}>
        <span className="text-secondary-600">{showLabels ? 'Tạm Tính' : 'Subtotal'}</span>
        <span className="font-semibold text-secondary-900">{formatCurrency(subtotal)}</span>
      </div>
      <div className={`flex items-center justify-between ${sizes.row}`}>
        <span className="text-secondary-600">{showLabels ? 'Thuế 12%' : 'Tax 12%'}</span>
        <span className="font-semibold text-secondary-900">{formatCurrency(tax)}</span>
      </div>
      <div className="h-px bg-secondary-200 my-1.5" />
      <div className={`flex items-center justify-between ${sizes.total}`}>
        <span className="font-semibold text-secondary-900">
          {showLabels ? 'Tổng Thanh Toán' : 'Total'}
        </span>
        <span className={`font-bold text-secondary-900 ${sizes.totalAmount}`}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  )
}

export default PriceSummary

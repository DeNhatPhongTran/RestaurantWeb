import React, { useState } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

export default function ChefOrderCard({ orderItem, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false)

  // Utility function to get status color
  const getStatusColor = (status, isEnabled) => {
    const colors = {
      waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      cooking: 'bg-orange-100 text-orange-800 border-orange-300',
      cooked: 'bg-green-100 text-green-800 border-green-300',
      served: 'bg-blue-100 text-blue-800 border-blue-300',
      unserved: 'bg-gray-100 text-gray-800 border-gray-300'
    }

    const disabledColors = {
      waiting: 'bg-yellow-50 text-yellow-500 border-yellow-100',
      cooking: 'bg-orange-50 text-orange-500 border-orange-100',
      cooked: 'bg-green-50 text-green-500 border-green-100',
      served: 'bg-blue-50 text-blue-500 border-blue-100',
      unserved: 'bg-gray-50 text-gray-500 border-gray-100'
    }

    return isEnabled ? colors[status] : disabledColors[status] || colors.waiting
  }

  // Utility function to get status label
  const getStatusLabel = (status) => {
    const labels = {
      waiting: 'Chờ Nấu',
      cooking: 'Đang Nấu',
      cooked: 'Đã Nấu',
      served: 'Đã Phục Vụ',
      unserved: 'Chưa Phục Vụ'
    }
    return labels[status] || status
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true)
    try {
      await onStatusChange(orderItem._id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if the order is served to disable button interactions
  const isOrderServed = orderItem.serving_status === 'served'

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <img 
          src={orderItem.item?.image || '/images/food/default-food.jpg'}
          alt={orderItem.item?.name}
          className="w-full h-full object-cover"
        />
        {/* Quantity Badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
          {orderItem.quantity}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 space-y-2">
        {/* Item Name */}
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {orderItem.item?.name}
        </h3>

        {/* Table Name */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-medium">Bàn:</span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            {orderItem.table_name || 'N/A'}
          </span>
        </div>

        {/* Status Section: Display both status and serving status */}
        <div className="space-y-2">
          {/* Display Cooking Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Trạng Thái Nấu:</span>
            <span className={`px-2 py-1 rounded ${getStatusColor(orderItem.status, !isOrderServed)}`}>
              {getStatusLabel(orderItem.status)}
            </span>
          </div>

          {/* Display Serving Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Trạng Thái Phục Vụ:</span>
            <span className={`px-2 py-1 rounded ${getStatusColor(orderItem.serving_status, !isOrderServed)}`}>
              {getStatusLabel(orderItem.serving_status)}
            </span>
          </div>
        </div>

        {/* Buttons to change cooking status */}
        {!isOrderServed && (
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            {['waiting', 'cooking', 'cooked'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isUpdating || orderItem.status === status || isOrderServed}
                className={`w-full py-2 text-sm rounded font-medium text-center transition-colors ${getStatusColor(status, orderItem.status !== status && !isOrderServed)} ${isUpdating ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        )}

        {/* Note (if exists) */}
        {orderItem.note && (
          <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded border-l-2 border-gray-300 mt-2">
            <div className="flex gap-1">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              <span>{orderItem.note}</span>
            </div>
          </div>
        )}

        {/* Time Info */}
        <div className="text-xs text-gray-400 text-right pt-1">
          {new Date(orderItem.ordered_at).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>
    </div>
  )
}

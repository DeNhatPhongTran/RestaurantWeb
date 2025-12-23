import { Bell, CheckCircle, Clock, FileX } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DELETE_REASONS, ITEM_STATUS_COLORS, ITEM_STATUS_LABELS } from '../../constants/orderConstants'
import ModalHeader from '../common/ModalHeader'
import QuantitySelector from '../common/QuantitySelector'
import { Button } from '../ui/button'

const DeleteItemConfirmModal = ({ isOpen, onClose, item, onConfirmDelete }) => {
  const [deleteQuantities, setDeleteQuantities] = useState({
    'not-sent': 0,
    'in-progress': 0,
    'ready': 0,
    'served': 0
  })
  const [deleteReason, setDeleteReason] = useState('')

  // Reset state when modal opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setDeleteQuantities({
        'not-sent': 0,
        'in-progress': 0,
        'ready': 0,
        'served': 0
      })
      setDeleteReason('')
    }
  }, [isOpen, item])

  if (!isOpen || !item) return null

  const deleteReasons = DELETE_REASONS

  const statusInfo = {
    'not-sent': {
      label: ITEM_STATUS_LABELS['not-sent'],
      icon: FileX,
      bgColor: ITEM_STATUS_COLORS['not-sent'].bg,
      textColor: ITEM_STATUS_COLORS['not-sent'].text
    },
    'in-progress': {
      label: ITEM_STATUS_LABELS['in-progress'],
      icon: Clock,
      bgColor: ITEM_STATUS_COLORS['in-progress'].bg,
      textColor: ITEM_STATUS_COLORS['in-progress'].text
    },
    'ready': {
      label: ITEM_STATUS_LABELS.ready,
      icon: Bell,
      bgColor: ITEM_STATUS_COLORS.ready.bg,
      textColor: ITEM_STATUS_COLORS.ready.text
    },
    'served': {
      label: ITEM_STATUS_LABELS.served,
      icon: CheckCircle,
      bgColor: ITEM_STATUS_COLORS.served.bg,
      textColor: ITEM_STATUS_COLORS.served.text
    }
  }

  const updateQuantity = (status, newValue) => {
    setDeleteQuantities({
      ...deleteQuantities,
      [status]: newValue
    })
  }

  const totalDeleteCount = Object.values(deleteQuantities).reduce((sum, qty) => sum + qty, 0)

  const handleConfirm = () => {
    if (totalDeleteCount > 0 && deleteReason) {
      onConfirmDelete(item.id, deleteQuantities, deleteReason)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Xác Nhận Huỷ Món"
            onClose={handleClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Item Info */}
            <div className="flex gap-3 mb-6 pb-4 border-b border-secondary-200">
              <img
                src={item.image || '/images/food/wagyu_steak.jpg'}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-secondary-900 mb-1">{item.name}</h3>
                {item.addOns && item.addOns.length > 0 && (
                  <div className="text-xs text-secondary-500 mb-1">
                    <span className="font-medium">Thêm:</span> {item.addOns.join(', ')}
                  </div>
                )}
                {item.note && (
                  <div className="text-xs text-secondary-500 italic">
                    Ghi chú: {item.note}
                  </div>
                )}
              </div>
            </div>

            {/* Status Quantities */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-secondary-900 mb-3">Chọn số lượng cần huỷ</h4>
              
              {Object.entries(item.statusQuantities).map(([status, quantity]) => {
                if (quantity === 0) return null
                
                const info = statusInfo[status]
                const Icon = info.icon
                
                return (
                  <div
                    key={status}
                    className={`${info.bgColor} rounded-lg p-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${info.textColor}`} />
                        <span className={`text-sm font-semibold ${info.textColor}`}>
                          {info.label}
                        </span>
                        <span className="text-xs text-secondary-600">
                          (Có: {quantity})
                        </span>
                      </div>
                      
                      {/* Quantity Selector */}
                      <QuantitySelector
                        value={deleteQuantities[status]}
                        onChange={(newValue) => updateQuantity(status, newValue)}
                        min={0}
                        max={quantity}
                        size="sm"
                        className="bg-transparent p-0"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Delete Reason */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm text-secondary-900 mb-3">Lý do huỷ</h4>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors text-sm"
              >
                <option value="">-- Chọn lý do --</option>
                {deleteReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary */}
            {totalDeleteCount > 0 && (
              <p className="font-semibold text-rose-600">
                Bạn có chắc chắn muốn huỷ {totalDeleteCount} phần {item.name}
                {Object.entries(deleteQuantities).map(([status, qty]) => {
                  if (qty === 0) return null
                  return (
                    <span key={status}>
                      {' '}({qty} {statusInfo[status].label})
                    </span>
                  )
                })}?
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-secondary-200 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleClose}
            >
              Đóng  
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 !bg-danger-600 hover:!bg-danger-700"
              onClick={handleConfirm}
              disabled={totalDeleteCount === 0 || !deleteReason}
            >
              Xác Nhận Huỷ
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteItemConfirmModal

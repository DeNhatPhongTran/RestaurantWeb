import { CreditCard } from 'lucide-react'
import React from 'react'
import { formatCurrency } from '../../utils'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const PaymentConfirmModal = ({ isOpen, onClose, order, onConfirmPayment }) => {
  if (!isOpen || !order) return null

  const handleConfirm = () => {
    onConfirmPayment(order.id)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  // Parse the total from string format "1.194.000" to number
  const totalAmount = parseFloat(order.total.replace(/\./g, ''))

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
            title="Xác Nhận Thanh Toán"
            icon={CreditCard}
            onClose={handleClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Order Information */}
            <div className="bg-secondary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-secondary-600">Mã đơn hàng</span>
                <span className="text-sm font-bold text-secondary-900">{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-secondary-600">Bàn số</span>
                <span className="text-sm font-bold text-secondary-900">{order.tableDisplayNumber}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-secondary-600">Số khách</span>
                <span className="text-sm font-bold text-secondary-900">{order.guestCount} người</span>
              </div>
              <div className="border-t border-secondary-200 my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-secondary-900">Tổng tiền</span>
                <span className="text-xl font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Confirmation Message */}
            
              <p className="pl-4 text-sm font-semibold text-warning-800">
                Bạn có chắc chắn muốn gửi yêu cầu thanh toán cho đơn {order.orderNumber}?
              </p>
          </div>

          {/* Footer with Actions */}
          <div className="flex gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleClose}
            >
              Huỷ
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleConfirm}
            >
              Gửi Yêu Cầu Thanh Toán
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentConfirmModal

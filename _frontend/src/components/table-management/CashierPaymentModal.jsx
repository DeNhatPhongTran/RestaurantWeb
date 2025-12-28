import { CreditCard, ShoppingCart } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'
import PaymentProcessModal from '../orders/PaymentProcessModal'
import { useApi } from '../../context/ApiContext'

const CashierPaymentModal = ({ isOpen, onClose, table, reservation }) => {
  const { apiCall } = useApi()
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  useEffect(() => {
    if (isOpen && reservation) {
      fetchOrderItems()
    }
  }, [isOpen, reservation])

  const fetchOrderItems = async () => {
    setLoading(true)
    try {
      const res = await apiCall(`/api/orderitems?reservation=${reservation._id}`, {
        method: 'GET',
      })
      if (res.success) {
        setOrderItems(res.data || [])
      }
    } catch (error) {
      console.error('Error fetching order items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !table || !reservation) return null

  const subtotal = orderItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            title={`💳 Thanh Toán Bàn ${table.name}`}
            icon={CreditCard}
            onClose={onClose}
          />

          <div className="flex-1 overflow-y-auto p-6">
            {/* Table Info */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-600">Bàn</span>
                <span className="font-bold text-primary-900">{table.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600">Sức chứa</span>
                <span className="font-bold text-primary-900">{table.capacity} chỗ</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                <ShoppingCart className="inline mr-2 h-5 w-5" />
                Danh Sách Món Gọi ({orderItems.length})
              </h3>

              {loading ? (
                <p className="text-secondary-600">Đang tải...</p>
              ) : orderItems.length === 0 ? (
                <p className="text-secondary-600 text-center py-6">Không có món nào</p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-secondary-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-secondary-900">
                          {item.item?.name || 'Không xác định'}
                        </p>
                        <p className="text-xs text-secondary-600">Số lượng: {item.quantity}</p>
                        {item.note && (
                          <p className="text-xs text-secondary-600 italic">Ghi chú: {item.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {(item.price_at_time * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-xs text-secondary-600">
                          {item.price_at_time.toLocaleString('vi-VN')}₫ x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-secondary-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Tạm tính</span>
                <span className="font-bold text-secondary-900">
                  {subtotal.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Thuế (12%)</span>
                <span className="font-bold text-secondary-900">{tax.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="border-t border-secondary-200 pt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-secondary-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary-600">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
            <Button variant="outline" size="md" className="flex-1" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => setIsPaymentOpen(true)}
              disabled={orderItems.length === 0}
            >
              Thanh Toán Ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentProcessModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false)
          onClose()
        }}
        order={{
          id: reservation._id,
          orderNumber: table.name,
          tableDisplayNumber: table.name,
          guestCount: table.capacity,
          total: total.toLocaleString('vi-VN'),
        }}
        orderItems={orderItems}
        onProcessPayment={() => {
          // After payment, close modal and refresh
          setIsPaymentOpen(false)
          onClose()
        }}
      />
    </>
  )
}

export default CashierPaymentModal

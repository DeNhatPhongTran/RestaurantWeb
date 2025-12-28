import React, { useState } from 'react'
import { AlertCircle, Loader, CheckCircle, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useApi } from '../../context/ApiContext'

const InvoiceDetailModal = ({ isOpen, onClose, invoice, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { apiCall } = useApi()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!invoice.all_items_served) {
      setError('Không thể thanh toán khi chưa phục vụ hết các món')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await apiCall(`/api/invoices/${invoice._id}/process-payment`, {
        method: 'PUT',
        body: JSON.stringify({
          payment_method: paymentMethod,
          total_price: invoice.total_amount
        })
      })

      if (response.success) {
        setShowSuccess(true)
        setTimeout(() => {
          onPaymentSuccess?.()
          onClose()
        }, 2000)
      } else {
        setError(response.message || 'Thanh toán thất bại')
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi thanh toán')
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (!isOpen || !invoice) return null

  const allServed = invoice.all_items_served
  const canPay = allServed && !processing

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="sticky top-0 bg-green-50 border-b-2 border-green-500 p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-800">Thanh toán thành công!</h3>
              <p className="text-sm text-green-700">Đang chuyển về trang hóa đơn...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Chi tiết thanh toán</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Reservation Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">ID đặt bàn</div>
                <div className="text-lg font-bold text-gray-800">{invoice._id.slice(-6)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bàn</div>
                <div className="text-lg font-bold text-gray-800">{invoice.table_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Khách hàng</div>
                <div className="text-base font-semibold text-gray-800">{invoice.customer_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Số khách</div>
                <div className="text-base font-semibold text-gray-800">{invoice.guest_count}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-lg mb-3">Các món đã gọi</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold">Món ăn</th>
                    <th className="text-center p-3 font-semibold w-16">SL</th>
                    <th className="text-right p-3 font-semibold w-24">Giá</th>
                    <th className="text-right p-3 font-semibold w-24">Tổng</th>
                    <th className="text-center p-3 font-semibold w-20">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.order_items?.map((item) => {
                    const total = item.price_at_time * item.quantity
                    return (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-gray-800">{item.item?.name}</div>
                            {item.note && <div className="text-xs text-gray-500">Ghi chú: {item.note}</div>}
                          </div>
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">{formatCurrency(item.price_at_time)}</td>
                        <td className="text-right p-3 font-semibold">{formatCurrency(total)}</td>
                        <td className="text-center p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.serving_status === 'served'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.serving_status === 'served' ? '✓ Phục vụ' : '○ Chờ'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Tạm tính:</span>
              <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Thuế (12%):</span>
              <span className="font-semibold">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>

          {/* Payment Status Warning */}
          {!allServed && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800">Không thể thanh toán</h4>
                <p className="text-sm text-orange-700">Vui lòng chờ phục vụ hết tất cả các món trước khi thanh toán</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Lỗi</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          {allServed && (
            <div className="space-y-3">
              <h3 className="font-bold">Phương thức thanh toán</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'cash', label: '💵 Tiền mặt' },
                  { value: 'card', label: '💳 Thẻ tín dụng' },
                  { value: 'bank', label: '🏦 Chuyển khoản' },
                  { value: 'ewallet', label: '📱 Ví điện tử' }
                ].map(method => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!canPay}
              className={`flex-1 ${
                canPay
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {processing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                '✓ Thanh toán'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetailModal

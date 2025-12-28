import React from 'react'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'

const InvoiceCard = ({ invoice, onCardClick, isPaid = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
  }

  if (isPaid) {
    return (
      <div
        role="button"
        tabIndex="0"
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
        onClick={onCardClick}
        onKeyDown={(e) => e.key === 'Enter' && onCardClick()}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600">ID đặt bàn</div>
            <div className="text-lg font-bold text-gray-800">{invoice.reservation_id.slice(-6)}</div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Đã TT</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bàn:</span>
            <span className="font-medium text-gray-800">{invoice.table_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Khách:</span>
            <span className="font-medium text-gray-800">{invoice.customer_name}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
            <span className="font-semibold text-gray-700">Tổng tiền:</span>
            <span className="font-bold text-lg text-green-600">{formatCurrency(invoice.total_amount)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>PP: {invoice.payment_method.toUpperCase()}</span>
            <span>{formatDateTime(invoice.paid_at)}</span>
          </div>
        </div>
      </div>
    )
  }

  // Unpaid invoice
  const canPayment = invoice.all_items_served

  return (
    <div
      role="button"
      tabIndex="0"
      className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-all p-4 cursor-pointer ${
        canPayment ? 'border-blue-300 hover:border-blue-500' : 'border-orange-300'
      }`}
      onClick={onCardClick}
      onKeyDown={(e) => e.key === 'Enter' && onCardClick()}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-600">ID đặt bàn</div>
          <div className="text-lg font-bold text-gray-800">{invoice._id.slice(-6)}</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded ${
          canPayment
            ? 'bg-blue-100'
            : 'bg-orange-100'
        }`}>
          {canPayment ? (
            <>
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Sẵn TT</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700">Chờ phục vụ</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Bàn:</span>
          <span className="font-medium text-gray-800">{invoice.table_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Khách:</span>
          <span className="font-medium text-gray-800">{invoice.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">SL:</span>
          <span className="font-medium text-gray-800">{invoice.guest_count}</span>
        </div>
        
        {!canPayment && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            ⚠️ Chưa phục vụ hết các món. Không thể thanh toán
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
          <span className="font-semibold text-gray-700">Tổng tiền:</span>
          <span className="font-bold text-lg text-blue-600">{formatCurrency(invoice.total_amount)}</span>
        </div>
      </div>
    </div>
  )
}

export default InvoiceCard

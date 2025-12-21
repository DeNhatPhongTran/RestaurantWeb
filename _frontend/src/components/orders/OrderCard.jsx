import { ChefHat, Clock as ClockIcon, CreditCard, LayoutGrid, Receipt, UtensilsCrossed } from 'lucide-react'
import React from 'react'
import { Card, CardBody } from '../ui/Card'

const OrderCard = ({ order, onServeItems, onPaymentRequest, onViewDetails, userRole = 'waiter' }) => {
  // Status color mapping
  const statusColors = {
    'serving': {
      border: 'border-l-4 border-l-primary-500',
      bg: 'bg-primary-50',
      icon: <ChefHat className="h-4 w-4 text-primary-600" />,
      iconBg: 'bg-primary-100'
    },
    'waiting': {
      border: 'border-l-4 border-l-warning-500',
      bg: 'bg-warning-50',
      icon: <ClockIcon className="h-4 w-4 text-warning-600" />,
      iconBg: 'bg-warning-100'
    }
  }

  const statusStyle = statusColors[order.statusType] || statusColors['serving']

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow w-full ${statusStyle.border}`}>
      <CardBody className="p-0">
        {/* Header - Order Info */}
        <div className="px-2 py-1.5 bg-secondary-50 border-b border-secondary-200">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="text-xs text-secondary-500 font-medium whitespace-nowrap">Đơn#</span>
              <span className="text-xs font-bold text-secondary-900 whitespace-nowrap">{order.orderNumber}</span>
            </div>
            <div className={`p-1 rounded-full ${statusStyle.iconBg}`}>
              {statusStyle.icon}
            </div>
          </div>
          <div className="text-xs text-secondary-500">{order.date}</div>
        </div>

        {/* Main Content */}
        <div className="px-2 py-2">
          {/* Table Number & Order Summary */}
          <div className="flex items-center gap-2.5 mb-2">
            {/* Table Number */}
            <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {order.tableDisplayNumber}
            </div>
            
            {/* Order Summary */}
            <div className="flex-1 min-w-0">
              <div className={`${statusStyle.bg} rounded-lg px-2 py-1.5 flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-secondary-700 flex-shrink-0" />
                  <span className="text-xs text-secondary-800 font-semibold whitespace-nowrap">{order.servedCount || 0}/{order.itemsCount} Món</span>
                </div>
                <span className="text-sm font-bold text-secondary-900 whitespace-nowrap">{order.total}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onViewDetails?.(order)}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border border-secondary-300 hover:bg-primary-50 hover:border-primary-400 transition-all group bg-white"
              title="Xem Chi Tiết"
            >
              <LayoutGrid className="h-4 w-4 text-secondary-600 group-hover:text-primary-600 mb-0.5" />
              <span className="text-xs text-secondary-700 group-hover:text-primary-600 font-medium whitespace-nowrap">Chi Tiết</span>
            </button>
            <button
              onClick={() => onServeItems?.(order)}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border border-secondary-300 hover:bg-primary-50 hover:border-primary-400 transition-all group bg-white"
              title="Phục Vụ Món"
            >
              <Receipt className="h-4 w-4 text-secondary-600 group-hover:text-primary-600 mb-0.5" />
              <span className="text-xs text-secondary-700 group-hover:text-primary-600 font-medium whitespace-nowrap">Phục Vụ</span>
            </button>
            <button
              onClick={() => onPaymentRequest?.(order)}
              disabled={order.statusType === 'waiting' && userRole === 'waiter'}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all group ${
                order.statusType === 'waiting' && userRole === 'waiter'
                  ? 'border-secondary-200 bg-secondary-50 cursor-not-allowed opacity-50'
                  : 'border-secondary-300 hover:bg-primary-50 hover:border-primary-400 bg-white'
              }`}
              title={
                order.statusType === 'waiting' && userRole === 'waiter'
                  ? 'Đơn hàng đang chờ thanh toán'
                  : userRole === 'cashier'
                  ? 'Thanh Toán'
                  : 'Yêu Cầu Thanh Toán'
              }
            >
              <CreditCard className={`h-4 w-4 mb-0.5 ${
                order.statusType === 'waiting' && userRole === 'waiter'
                  ? 'text-secondary-400' 
                  : 'text-secondary-600 group-hover:text-primary-600'
              }`} />
              <span className={`text-xs font-medium whitespace-nowrap ${
                order.statusType === 'waiting' && userRole === 'waiter'
                  ? 'text-secondary-400'
                  : 'text-secondary-700 group-hover:text-primary-600'
              }`}>
                {userRole === 'cashier' ? 'Thanh Toán' : 'YC Thanh Toán'}
              </span>
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default OrderCard

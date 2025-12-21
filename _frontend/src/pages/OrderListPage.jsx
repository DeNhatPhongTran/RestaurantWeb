import { File, Plus } from 'lucide-react'
import React, { useState } from 'react'
import SearchBar from '../components/common/SearchBar'
import CreateOrderModal from '../components/orders/CreateOrderModal'
import OrderCard from '../components/orders/OrderCard'
import OrderDetailModal from '../components/orders/OrderDetailModal'
import PaymentConfirmModal from '../components/orders/PaymentConfirmModal'
import PaymentProcessModal from '../components/orders/PaymentProcessModal'
import { Button } from '../components/ui/Button'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { mockOrderItems, mockOrders, mockWaitingOrderItems } from '../data'

const OrderListPage = ({ userRole = 'waiter' }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('time-desc')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState(mockOrders)

  const tabCounts = {
    all: orders.length,
    serving: orders.filter((o) => o.statusType === 'serving').length,
    waiting: orders.filter((o) => o.statusType === 'waiting').length,
  }

  const filteredOrders = orders
    .filter((order) => {
      const matchesTab = activeTab === 'all' || order.statusType === activeTab
      const matchesSearch =
        !searchQuery ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'time-asc':
          // Parse date strings and compare (earlier dates first)
          return new Date(a.date) - new Date(b.date)
        case 'time-desc':
          // Parse date strings and compare (later dates first)
          return new Date(b.date) - new Date(a.date)
        case 'table-asc':
          // Compare table numbers (ascending)
          return a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true })
        case 'table-desc':
          // Compare table numbers (descending)
          return b.tableNumber.localeCompare(a.tableNumber, undefined, { numeric: true })
        default:
          return 0
      }
    })

  const handleSelectOrder = (orderId, isSelected) => {
    const newSelected = new Set(selectedOrders)
    if (isSelected) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleServeItems = (order) => {
    console.log('Serve items:', order)
  }

  const handlePaymentRequest = (order) => {
    setSelectedOrder(order)
    setIsPaymentModalOpen(true)
  }

  const handleConfirmPayment = (orderId) => {
    console.log('Payment confirmed for order:', orderId)
    // Update order status to waiting
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, statusType: 'waiting', status: 'Chờ Thanh Toán' }
          : order
      )
    )
    // Update selectedOrder if it's the one being updated
    setSelectedOrder(prev => 
      prev?.id === orderId 
        ? { ...prev, statusType: 'waiting', status: 'Chờ Thanh Toán' }
        : prev
    )
  }

  const handleProcessPayment = (paymentData) => {
    console.log('Payment processed:', paymentData)
    // Update order status to completed
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === paymentData.orderId 
          ? { ...order, statusType: 'completed', status: 'Hoàn Thành' }
          : order
      )
    )
    // Update selectedOrder if it's the one being updated
    setSelectedOrder(prev => 
      prev?.id === paymentData.orderId 
        ? { ...prev, statusType: 'completed', status: 'Hoàn Thành' }
        : prev
    )
  }

  return (
    <div className="p-6">
      {/* Page Title with Icon */}
      <div className="flex items-center gap-3 mb-6">
        <File className="h-6 w-6 text-secondary-900" />
        <h1 className="text-2xl font-bold text-secondary-900">Đơn Hàng</h1>
      </div>

      {/* Search, Sort, and Create Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <div className="flex-1 w-full lg:w-auto max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm theo ID đơn hàng"
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Button 
            variant="primary" 
            size="md" 
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Tạo Đơn Mới
          </Button>
        </div>
      </div>

      {/* Tabs and Sort */}
      <div className="flex items-center justify-between mb-6">
        <Tabs className="flex-1">
          <TabsList className="flex gap-0 border-b border-secondary-200 bg-transparent p-0 overflow-x-auto">
          <TabsTrigger
            isActive={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className="px-3 md:px-3.5 lg:px-4 py-2 border-b-2 border-transparent flex items-center"
          >
            <span className="text-xs md:text-sm lg:text-base">Tất Cả</span>
            <span className="inline-flex items-center justify-center h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 rounded-full bg-primary-500 text-white text-xs font-semibold ml-2.5">
              {tabCounts.all}
            </span>
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === 'serving'}
            onClick={() => setActiveTab('serving')}
            className="px-3 md:px-3.5 lg:px-4 py-2 border-b-2 border-transparent flex items-center"
          >
            <span className="text-xs md:text-sm lg:text-base whitespace-nowrap">Đang phục vụ</span>
            <span className="inline-flex items-center justify-center h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 rounded-full bg-primary-400 text-white text-xs font-semibold ml-2.5">
              {tabCounts.serving}
            </span>
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === 'waiting'}
            onClick={() => setActiveTab('waiting')}
            className="px-3 md:px-3.5 lg:px-4 py-2 border-b-2 border-transparent flex items-center"
          >
            <span className="text-xs md:text-sm lg:text-base whitespace-nowrap">Chờ Thanh Toán</span>
            <span className="inline-flex items-center justify-center h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 rounded-full bg-warning-400 text-white text-xs font-semibold ml-2.5">
              {tabCounts.waiting}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-medium text-secondary-600 whitespace-nowrap">Sắp xếp:</span>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-secondary-300 bg-white text-xs md:text-sm font-medium text-secondary-700 hover:border-secondary-400 transition-colors"
        >
          <option value="time-desc">Thời Gian (Mới Nhất)</option>
          <option value="time-asc">Thời Gian (Cũ Nhất)</option>
          <option value="table-asc">Bàn (Tăng Dần)</option>
          <option value="table-desc">Bàn (Giảm Dần)</option>
        </select>
      </div>
    </div>

      {/* Orders Grid - Tablet-first design for 1024x768 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
              onServeItems={handleServeItems}
              onPaymentRequest={handlePaymentRequest}
              userRole={userRole}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-secondary-600 text-lg font-medium">Không tìm thấy đơn hàng</p>
            <p className="text-secondary-500 text-sm">Thử điều chỉnh tiêu chí tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onOrderUpdate={(updatedOrder) => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
          )
          setSelectedOrder(updatedOrder)
        }}
      />

      {/* Payment Modal - Different for Cashier vs Waiter */}
      {userRole === 'cashier' ? (
        <PaymentProcessModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
          orderItems={selectedOrder?.statusType === 'waiting' ? mockWaitingOrderItems : mockOrderItems}
          onProcessPayment={handleProcessPayment}
        />
      ) : (
        <PaymentConfirmModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  )
}

export default OrderListPage

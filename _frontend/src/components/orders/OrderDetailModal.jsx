import { ArrowRightLeft, Baby, Bell, CheckCircle, Clock, FileX, Plus, Send, Trash2, Users } from 'lucide-react'
import React, { useState } from 'react'
import { mockOrderItems } from '../../data'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import Modal from '../ui/Modal'
import DeleteItemConfirmModal from './DeleteItemConfirmModal'
import EditOrderModal from './EditOrderModal'

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  
  // Import mock order items data
  const [orderItems, setOrderItems] = useState(mockOrderItems)
  
  if (!isOpen || !order) return null

  const handleChangeTable = () => {
    console.log('Change table for order:', order.orderNumber)
    // TODO: Implement change table functionality
  }

  const handleAddItem = () => {
    setIsEditModalOpen(true)
  }

  const handleDeleteItem = (item) => {
    console.log('Opening delete modal for item:', item.id)
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = (itemId, deleteQuantities, deleteReason) => {
    console.log('Deleting item:', itemId, deleteQuantities, deleteReason)
    
    // Find the item and update its quantities
    const updatedItems = orderItems.map(item => {
      if (item.id === itemId) {
        // Subtract the deleted quantities from status quantities
        const newStatusQuantities = { ...item.statusQuantities }
        Object.entries(deleteQuantities).forEach(([status, qty]) => {
          newStatusQuantities[status] -= qty
        })
        
        // Calculate new total quantity
        const newTotalQty = Object.values(newStatusQuantities).reduce((sum, qty) => sum + qty, 0)
        
        // If total quantity becomes 0, remove the item
        if (newTotalQty === 0) {
          return null
        }
        
        return {
          ...item,
          statusQuantities: newStatusQuantities,
          quantity: newTotalQty
        }
      }
      return item
    }).filter(item => item !== null)
    
    setOrderItems(updatedItems)
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
    // TODO: Send delete request to backend with deleteReason
  }

  const handleEditModalClose = (updatedItems) => {
    setIsEditModalOpen(false)
    if (updatedItems) {
      console.log('Updated order items:', updatedItems)
      
      // Convert items from EditOrderModal format to OrderDetailModal format
      const formattedItems = updatedItems.map(item => {
        // If item already has statusQuantities, keep it
        if (item.statusQuantities) {
          return item
        }
        
        // If item has status (newly added from EditOrderModal), create statusQuantities
        const statusQuantities = {
          'served': 0,
          'ready': 0,
          'in-progress': 0,
          'not-sent': 0
        }
        
        // Set the quantity for the appropriate status
        if (item.status) {
          statusQuantities[item.status] = item.quantity
        } else {
          // Default to not-sent if no status specified
          statusQuantities['not-sent'] = item.quantity
        }
        
        return {
          ...item,
          statusQuantities
        }
      })
      
      setOrderItems(formattedItems)
    }
  }

  const handleSendToKitchen = () => {
    console.log('Send to kitchen:', order.orderNumber)
    // TODO: Implement send to kitchen functionality
  }
  const handleServe = () => {
    console.log('Serve items for order:', order.orderNumber)
    // TODO: Implement serve functionality
  }

  // Status styles
  const statusStyles = {
    'not-sent': {
      variant: 'default',
      icon: <FileX className="h-3.5 w-3.5" />,
      label: 'Chưa gửi bếp'
    },
    'served': {
      variant: 'success',
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      label: 'Đã Phục Vụ'
    },
    'ready': {
      variant: 'warning',
      icon: <Bell className="h-3.5 w-3.5" />,
      label: 'Sẵn Sàng'
    },
    'in-progress': {
      variant: 'primary',
      icon: <Clock className="h-3.5 w-3.5" />,
      label: 'Đang Nấu'
    }
  }

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  // Calculate total quantities for each status
  const statusCounts = orderItems.reduce((acc, item) => {
    acc.served += item.statusQuantities.served || 0
    acc.ready += item.statusQuantities.ready || 0
    acc['in-progress'] += item.statusQuantities['in-progress'] || 0
    acc['not-sent'] += item.statusQuantities['not-sent'] || 0
    return acc
  }, { 'served': 0, 'ready': 0, 'in-progress': 0, 'not-sent': 0 })

  const servedCount = statusCounts.served
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const progress = Math.round((servedCount / totalItems) * 100)

  // Helper function to get primary status (most urgent status with quantity > 0)
  const getPrimaryStatus = (statusQuantities) => {
    if (statusQuantities.ready > 0) return 'ready'
    if (statusQuantities['in-progress'] > 0) return 'in-progress'
    if (statusQuantities['not-sent'] > 0) return 'not-sent'
    return 'served'
  }

  // Helper function to get border color based on status priority
  const getBorderColor = (statusQuantities) => {
    // Priority: Ready > In Progress > All Served > Not Sent
    if (statusQuantities.ready > 0) {
      return 'border-warning-400'
    }
    if (statusQuantities['in-progress'] > 0) {
      return 'border-primary-400'
    }
    // Check if all quantity is served
    const totalQuantity = Object.values(statusQuantities).reduce((sum, q) => sum + q, 0)
    if (statusQuantities.served === totalQuantity && totalQuantity > 0) {
      return 'border-success-400'
    }
    // All not sent or mixed with not-sent
    return 'border-secondary-300'
  }

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Đơn Hàng"
      size="xl"
    >
      <div className="flex-1 overflow-hidden flex flex-col h-full">
        {/* Order Info Header - Full Width */}
        <div className="px-4 py-3 border-b border-secondary-200">
          <div className="flex items-center justify-between mb-2">
            {/* Left: Order number and time */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 text-white px-3 py-1.5 rounded-lg">
                <span className="text-xs font-semibold">Đơn# {order.orderNumber}</span>
              </div>
              <span className="text-xs text-secondary-500">{order.date}</span>
            </div>
            
            {/* Right: Table indicator and change button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg">
                <span className="text-sm font-semibold text-primary-600">Bàn {order.tableDisplayNumber}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeTable}
                className="gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Đổi Bàn
              </Button>
            </div>
          </div>
          
          {/* Table Information Row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-secondary-700">
              <Users className="h-4 w-4" />
              <span className="font-medium">{order.guestCount} khách</span>
            </div>
            {order.babyChairCount > 0 && (
              <div className="flex items-center gap-1.5 text-secondary-700">
                <Baby className="h-4 w-4" />
                <span className="font-medium">{order.babyChairCount} ghế trẻ em</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Order Items */}
          <div className="flex-1 flex flex-col relative">
            {/* Action Buttons - Fixed at Top */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-secondary-200 px-4 py-3 shadow-sm">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="gap-2"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4" />
                  Thêm Món
                </Button>
              </div>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto px-4 pt-20 pb-3">
              <div className="space-y-3">
                {orderItems
                  .sort((a, b) => {
                    // Sort by most urgent status with quantity > 0
                    const statusPriority = {
                      'ready': 1,
                      'in-progress': 2,
                      'served': 3,
                      'not-sent': 4
                    }
                    const aPrimary = getPrimaryStatus(a.statusQuantities)
                    const bPrimary = getPrimaryStatus(b.statusQuantities)
                    return statusPriority[aPrimary] - statusPriority[bPrimary]
                  })
                  .map((item) => {
                  const primaryStatus = getPrimaryStatus(item.statusQuantities)
                  const statusStyle = statusStyles[primaryStatus]
                  const borderColor = getBorderColor(item.statusQuantities)
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-lg border-2 overflow-hidden relative ${borderColor}`}
                    >
                      {/* Status Badges - Fixed at top right, rightmost is always ready */}
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
                        <div className="flex gap-1">
                          {/* Not Sent */}
                          {item.statusQuantities['not-sent'] > 0 && (
                            <Badge variant="default" className="shadow-sm">
                              <FileX className="h-3 w-3" />
                              {item.statusQuantities['not-sent']}
                            </Badge>
                          )}
                          {/* In Progress */}
                          {item.statusQuantities['in-progress'] > 0 && (
                            <Badge variant="primary" className="shadow-sm">
                              <Clock className="h-3 w-3" />
                              {item.statusQuantities['in-progress']}
                            </Badge>
                          )}
                          {/* Served */}
                          {item.statusQuantities.served > 0 && (
                            <Badge variant="success" className="shadow-sm">
                              <CheckCircle className="h-3 w-3" />
                              {item.statusQuantities.served}
                            </Badge>
                          )}
                          {/* Ready - Always rightmost */}
                          {item.statusQuantities.ready > 0 && (
                            <Badge variant="warning" className="shadow-sm">
                              <Bell className="h-3 w-3" />
                              {item.statusQuantities.ready}
                            </Badge>
                          )}
                        </div>
                        {/* Served count */}
                        <span className="text-xs font-semibold text-success-700">
                          Đã phục vụ: {item.statusQuantities.served}/{item.quantity}
                        </span>
                      </div>

                      <div className="flex gap-3 p-3 relative">
                        {/* Item Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 bg-secondary-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Quantity Badge */}
                          <div className="absolute top-1 right-1 bg-secondary-900 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                            x{item.quantity}
                          </div>
                        </div>
                        
                        {/* Item Info */}
                        <div className="flex-1 min-w-0 pr-10">
                          <h4 className="font-semibold text-sm text-secondary-900 mb-1">
                            {item.name}
                          </h4>
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="text-xs text-secondary-500 mb-1">
                              <span className="font-medium">Thêm:</span> {item.addOns.join(', ')}
                            </div>
                          )}
                          
                          {/* Note */}
                          {item.note && (
                            <div className="text-xs text-secondary-500 italic mb-2">
                              Ghi chú: {item.note}
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="text-sm font-bold text-secondary-900">
                            {item.price.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                        
                        {/* Delete Button - Absolute Bottom Right */}
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="absolute bottom-2 right-2 px-2 py-1 flex items-center gap-1.5 rounded-md border-danger-400 hover:bg-danger-50 transition-colors"
                          title="Xóa món"
                        >
                          <span className="text-xs font-semibold text-danger-400">Huỷ</span>
                          <Trash2 className="h-3.5 w-3.5 text-danger-400" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Status Info & Payment */}
          <div className="w-80 flex flex-col px-6 py-4 border-l border-secondary-200">
            <h2 className="text-lg font-bold text-secondary-900 mb-6">
              Trạng Thái Món Ăn
            </h2>
            
            <div className="space-y-2 mb-6">
              {/* Status */}
              <div className="rounded-lg overflow-hidden border border-secondary-200 shadow-md">
                {/* Not Sent Status */}
                <div className="p-3 bg-secondary-50 border-b border-secondary-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileX className="h-4 w-4 text-secondary-700 flex-shrink-0" />
                      <span className="text-sm text-secondary-700 font-medium">Chưa gửi bếp</span>
                    </div>
                    <span className="text-base font-bold text-secondary-700 tabular-nums">
                      {statusCounts['not-sent']}
                    </span>
                  </div>
                  {statusCounts['not-sent'] > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 h-8 bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-100 hover:border-secondary-400 font-semibold"
                      onClick={handleSendToKitchen}
                    >
                      <Send className="h-4 w-4" />
                      Gửi Bếp
                    </Button>
                  )}
                </div>

                {/* Ready Status */}
                <div className="p-3 bg-warning-50 border-b border-secondary-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-warning-700 flex-shrink-0" />
                      <span className="text-sm text-warning-700 font-medium">Sẵn Sàng</span>
                    </div>
                    <span className="text-base font-bold text-warning-700 tabular-nums">
                      {statusCounts.ready}
                    </span>
                  </div>
                  {statusCounts.ready > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 h-8 bg-white border-warning-300 text-warning-700 hover:bg-warning-100 hover:border-warning-400 font-semibold"
                      onClick={handleServe}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Phục Vụ
                    </Button>
                  )}
                </div>

                {/* In Progress Status */}
                <div className="p-3 bg-primary-50 border-b border-secondary-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-700 flex-shrink-0" />
                      <span className="text-sm text-primary-700 font-medium">Đang Nấu</span>
                    </div>
                    <span className="text-base font-bold text-primary-700 tabular-nums">
                      {statusCounts['in-progress']}
                    </span>
                  </div>
                </div>

                {/* Served Status */}
                <div className="p-3 bg-success-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-700 flex-shrink-0" />
                      <span className="text-sm text-success-700 font-medium">Đã Phục Vụ</span>
                    </div>
                    <span className="text-base font-bold text-success-700 tabular-nums">
                      {statusCounts.served}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-auto">
              <div className="bg-white rounded-lg p-4 border border-secondary-200 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Tạm Tính</span>
                    <span className="font-semibold text-secondary-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Thuế 12%</span>
                    <span className="font-semibold text-secondary-900">{tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="h-px bg-secondary-300 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base text-secondary-900">Tổng</span>
                    <span className="text-xl font-bold text-secondary-900">{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={onClose}
              >
                Yêu Cầu Thanh Toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    
    {/* Edit Order Modal */}
    <EditOrderModal
      isOpen={isEditModalOpen}
      onClose={handleEditModalClose}
      orderItems={orderItems}
      orderNumber={order.orderNumber}
    />
    
    {/* Delete Item Confirm Modal */}
    <DeleteItemConfirmModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        setIsDeleteModalOpen(false)
        setItemToDelete(null)
      }}
      item={itemToDelete}
      onConfirmDelete={handleConfirmDelete}
    />
    </>
  )
}

export default OrderDetailModal

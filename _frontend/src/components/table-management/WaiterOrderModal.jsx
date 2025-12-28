import { ChefHat, Plus, Trash2, ShoppingCart } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'
import { useApi } from '../../context/ApiContext'

const WaiterOrderModal = ({ isOpen, onClose, table, reservation }) => {
  const { apiCall } = useApi()
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    if (isOpen && reservation) {
      fetchOrderItems()
      fetchMenuItems()
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

  const fetchMenuItems = async () => {
    try {
      const res = await apiCall('/api/menu', { method: 'GET' })
      if (res.success) {
        setMenuItems(res.data || [])
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc muốn xóa món này?')) return

    try {
      const res = await apiCall(`/api/orderitems/${itemId}`, { method: 'DELETE' })
      if (res.success) {
        setOrderItems(orderItems.filter((item) => item._id !== itemId))
      } else {
        alert('Xóa thất bại: ' + (res.error || 'Lỗi không xác định'))
      }
    } catch (error) {
      console.error('Error deleting order item:', error)
      alert('Lỗi khi xóa: ' + error.message)
    }
  }

  const handleAddItem = async (menuItem) => {
    if (!menuItem) return

    const quantity = prompt('Nhập số lượng:', '1')
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return

    const note = prompt('Ghi chú (nếu có):', '')

    try {
      const res = await apiCall('/api/orderitems', {
        method: 'POST',
        body: JSON.stringify({
          reservation: reservation._id,
          item: menuItem._id,
          quantity: Number(quantity),
          note: note || '',
          price_at_time: menuItem.price,
          status: 'waiting',
          serving_status: 'unserved',
        }),
      })

      if (res.success) {
        fetchOrderItems()
        setIsAddItemOpen(false)
      } else {
        alert('Thêm món thất bại: ' + (res.error || 'Lỗi không xác định'))
      }
    } catch (error) {
      console.error('Error adding order item:', error)
      alert('Lỗi khi thêm: ' + error.message)
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

      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          className="bg-white rounded-t-2xl shadow-2xl w-full h-[95vh] overflow-hidden flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            title={`👨‍🍳 Gọi Món - Bàn ${table.name}`}
            icon={ChefHat}
            onClose={onClose}
          />

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full">
              {/* Left Panel - Order Items */}
              <div className="flex flex-col space-y-3 overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2 flex items-center">
                    <ShoppingCart className="w-4 h-4 text-primary-500 inline-block align-middle mr-1" /> 
                    Danh Sách Món ({orderItems.length})
                  </h3>
                  <div className="bg-primary-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-600">Bàn</span>
                      <span className="font-bold text-primary-900">{table.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-600">Sức chứa</span>
                      <span className="font-bold text-primary-900">{table.capacity} chỗ</span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="bg-secondary-50 rounded-lg p-3 flex-1 flex flex-col min-h-0">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-secondary-600">Đang tải...</p>
                      </div>
                    ) : orderItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <ShoppingCart className="h-12 w-12 text-secondary-300 mb-2" />
                        <p className="text-secondary-600 mb-2">Chưa có món nào được gọi</p>
                        <Button size="sm" variant="primary" onClick={() => setIsAddItemOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Thêm Món Đầu Tiên
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                        {orderItems.map((item) => {
                          const isWaiting = item.status === 'waiting'
                          const canDelete = isWaiting

                          return (
                            <div key={item._id} className="bg-white rounded-lg p-3 border border-secondary-100">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-secondary-900 text-sm mb-1">
                                    {item.item?.name || 'Không xác định'}
                                  </p>
                                  
                                  {/* Status Badges */}
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                      item.status === 'waiting'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : item.status === 'cooking'
                                          ? 'bg-orange-100 text-orange-800'
                                          : 'bg-green-100 text-green-800'
                                    }`}>
                                      {item.status === 'waiting' ? '⏳ Chờ' : item.status === 'cooking' ? '🍳 Nấu' : '✅ Xong'}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                      item.serving_status === 'served'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.serving_status === 'served' ? '🍽️ Phục vụ' : '⏱️ Chưa phục'}
                                    </span>
                                  </div>

                                  {/* Quantity and Price */}
                                  <div className="flex items-center justify-between text-xs text-secondary-600 mb-1">
                                    <span>SL: <span className="font-bold text-secondary-900">{item.quantity}</span></span>
                                    <span className="font-semibold text-primary-600">
                                      {(item.price_at_time * item.quantity).toLocaleString('vi-VN')}₫
                                    </span>
                                  </div>

                                  {/* Note */}
                                  {item.note && (
                                    <p className="text-xs text-secondary-600 italic mt-1 line-clamp-1">
                                      📝 {item.note}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Delete Button */}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center justify-center gap-1 font-medium border-t border-secondary-100 mt-2"
                                >
                                  <Trash2 className="h-3 w-3" /> Xóa
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {orderItems.length > 0 && (
                  <div className="bg-secondary-50 rounded-lg p-3 space-y-1.5 flex-shrink-0">
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-secondary-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Thuế 12%</span>
                      <span className="font-semibold text-secondary-900">{Math.round(tax).toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-secondary-200">
                      <span className="font-bold text-secondary-900">Tổng</span>
                      <span className="text-base font-bold text-primary-600">{Math.round(total).toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Add Item */}
              <div className="flex flex-col space-y-3 overflow-hidden">
                <div className="flex-shrink-0">
                  <h3 className="text-sm font-semibold text-secondary-700 mb-2">Thêm Món Mới</h3>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => setIsAddItemOpen(!isAddItemOpen)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Gọi Món
                  </Button>
                </div>

                {/* Menu Items List */}
                {isAddItemOpen && (
                  <div className="flex-1 flex flex-col min-h-0 bg-secondary-50 rounded-lg p-3 overflow-hidden">
                    <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
                      {menuItems.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <p className="text-secondary-600 text-sm">Không có món nào</p>
                        </div>
                      ) : (
                        menuItems.map((item) => (
                          <button
                            key={item._id}
                            onClick={() => handleAddItem(item)}
                            className="w-full text-left p-2 hover:bg-white rounded-lg transition-colors border border-secondary-200 hover:border-primary-300"
                          >
                            <p className="font-semibold text-secondary-900 text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-secondary-600">{item.price?.toLocaleString('vi-VN')}₫</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 p-4 border-t border-secondary-200 bg-secondary-50 flex-shrink-0">
            <Button variant="outline" size="md" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={() => setIsAddItemOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Gọi Thêm Món
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WaiterOrderModal

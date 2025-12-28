import { ChefHat, Plus, Trash2, ShoppingCart, Edit2, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'
import { useApi } from '../../context/ApiContext'
import AddMenuItemModal from './AddMenuItemModal'

const WaiterOrderModal = ({ isOpen, onClose, table, reservation: initialReservation }) => {
  const { apiCall } = useApi()
  const [reservation, setReservation] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [editingItemId, setEditingItemId] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (isOpen && initialReservation?.data) {
      setReservation(initialReservation.data)
      setOrderItems(initialReservation.data.orderItems || [])
      fetchMenuItems()
    } else {
      setReservation(null)
      setOrderItems([])
    }
  }, [isOpen, initialReservation])

  const refetchOrderItems = async () => {
    if (!reservation?._id) return;
    setLoading(true);
    try {
      const res = await apiCall(`/api/reservations/${reservation._id}`, { method: 'GET' });
      if (res.success) {
        console.log('Dữ liệu sau khi gọi refetch:', res.data);
        setReservation(res.data);
        setOrderItems(res.data.orderItems || []);
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchMenuItems = async () => {
    try {
      const res = await apiCall('/api/dish_menu/list', { method: 'GET' })
      console.log("menu: ", res)
      if (res.success) {
        setMenuItems(res.data || [])
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const groupedItems = {
    waiting: orderItems.filter(item => item.status === 'waiting'),
    cooking: orderItems.filter(item => item.status === 'cooking'),
    cooked: orderItems.filter(item => item.status === 'cooked')
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc muốn xóa món này?')) return

    try {
      const res = await apiCall(`/api/orderitems/${itemId}`, {
        method: 'DELETE',
      })
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

  const startEditItem = (item) => {
    setEditingItemId(item._id)
    setEditData({
      quantity: item.quantity,
      note: item.note || '',
      itemId: item.item?._id
    })
  }

  // Save edit item
  const handleSaveEdit = async (itemId) => {
    try {
      const res = await apiCall(`/api/orderitems/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity: editData.quantity,
          note: editData.note,
          item: editData.itemId
        })
      })
      if (res.success) {
        setOrderItems(orderItems.map(item =>
          item._id === itemId
            ? { ...item, quantity: editData.quantity, note: editData.note }
            : item
        ))
        setEditingItemId(null)
        setEditData({})
      } else {
        alert('Cập nhật thất bại: ' + (res.error || 'Lỗi không xác định'))
      }
    } catch (error) {
      console.error('Error updating order item:', error)
      alert('Lỗi khi cập nhật: ' + error.message)
    }
  }

  // Handle add items from AddMenuItemModal
  const handleAddItems = async (selectedItems) => {
    try {
      const invalidItems = selectedItems.filter(item =>
        !item.menuItem || !item.menuItem._id || !item.quantity || !item.menuItem.price
      );

      if (invalidItems.length > 0) {
        console.error("Dữ liệu món không hợp lệ:", invalidItems);
        alert("Có món không hợp lệ, vui lòng kiểm tra lại.");
        return;
      }

      const promises = selectedItems.map(item =>
        apiCall('/api/orderitems', {
          method: 'POST',
          body: JSON.stringify({
            reservation: reservation._id,
            item: item.menuItem._id,
            quantity: item.quantity,
            note: item.note || '',
            price_at_time: item.menuItem.price,
            status: 'waiting',
            serving_status: 'unserved',
            ordered_at: new Date().toISOString()
          })
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        await refetchOrderItems();
        setIsAddItemOpen(false);

      } else {
        alert('Có lỗi khi thêm một số món');
      }
    } catch (error) {
      console.error('Error adding items:', error);
      alert('Lỗi khi thêm món: ' + error.message);
    }
  };


  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Render order item card
  const renderOrderItemCard = (item) => {
    const isEditing = editingItemId === item._id
    const canEdit = item.status === 'waiting'
    const isLocked = item.status === 'cooking' || item.status === 'cooked'

    return (
      <div
        key={item._id}
        className={`rounded-lg p-3 border-2 transition-all ${isEditing
          ? 'border-primary-500 bg-primary-50'
          : 'border-secondary-100 bg-white hover:border-secondary-200'
          }`}
      >
        {isEditing ? (
          // Edit Mode
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold text-secondary-700 block mb-1">
                Số lượng
              </label>
              <input
                type="number"
                min="1"
                value={editData.quantity}
                onChange={(e) => setEditData({ ...editData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-2 py-1 border border-primary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary-700 block mb-1">
                Ghi chú
              </label>
              <input
                type="text"
                value={editData.note}
                onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                className="w-full px-2 py-1 border border-primary-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveEdit(item._id)}
                className="flex-1 bg-primary-500 text-white py-1.5 rounded text-xs font-semibold hover:bg-primary-600 transition-colors"
              >
                ✓ Lưu
              </button>
              <button
                onClick={() => setEditingItemId(null)}
                className="flex-1 bg-secondary-200 text-secondary-700 py-1.5 rounded text-xs font-semibold hover:bg-secondary-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          // Display Mode
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-secondary-900 text-sm mb-1">
                  {item.item?.name || 'Không xác định'}
                </p>

                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : item.status === 'cooking'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {item.status === 'waiting' ? '⏳ Chờ' : item.status === 'cooking' ? '🍳 Nấu' : '✅ Xong'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.serving_status === 'served'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {item.serving_status === 'served' ? '🍽️ Phục vụ' : '⏱️ Chưa'}
                  </span>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between text-xs text-secondary-600 mb-1">
                  <span>
                    SL: <span className="font-bold text-secondary-900">{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-primary-600">
                    {(item.price_at_time * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {/* Time */}
                {item.ordered_at && (
                  <div className="text-xs text-secondary-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.ordered_at)}
                  </div>
                )}

                {/* Note */}
                {item.note && (
                  <p className="text-xs text-secondary-600 italic mt-1 line-clamp-1">
                    📝 {item.note}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex gap-2 pt-2 border-t border-secondary-100">
                <button
                  onClick={() => startEditItem(item)}
                  className="flex-1 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-1.5 rounded transition-colors flex items-center justify-center gap-1 font-medium"
                >
                  <Edit2 className="h-3 w-3" /> Sửa
                </button>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center justify-center gap-1 font-medium"
                >
                  <Trash2 className="h-3 w-3" /> Xóa
                </button>
              </div>
            )}
            {isLocked && (
              <div className="text-xs text-secondary-500 italic mt-2 p-1.5 bg-secondary-50 rounded text-center">
                ⛔ Không thể chỉnh sửa khi đang nấu/đã nấu xong
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (!isOpen || !table || !reservation) return null

  const subtotal = orderItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  return (
    <>
      {/* AddMenuItemModal */}
      <AddMenuItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        menuItems={menuItems}
        onConfirm={handleAddItems}
      />

      {/* Main Order Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
              {/* Left Panel - Order Items Grouped by Status */}
              <div className="lg:col-span-2 flex flex-col space-y-3 overflow-hidden">
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

                {/* Items by Status */}
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-secondary-600">Đang tải...</p>
                    </div>
                  ) : orderItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ShoppingCart className="h-12 w-12 text-secondary-300 mb-2" />
                      <p className="text-secondary-600 mb-3">Chưa có món nào được gọi</p>
                      <Button size="sm" variant="primary" onClick={() => setIsAddItemOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm Món Đầu Tiên
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Waiting Section */}
                      {groupedItems.waiting.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full inline-block mb-2">
                            ⏳ CHỜ NẤU ({groupedItems.waiting.length})
                          </h4>
                          <div className="space-y-2">
                            {groupedItems.waiting.map(item => renderOrderItemCard(item))}
                          </div>
                        </div>
                      )}

                      {/* Cooking Section */}
                      {groupedItems.cooking.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full inline-block mb-2">
                            🍳 ĐANG NẤU ({groupedItems.cooking.length})
                          </h4>
                          <div className="space-y-2">
                            {groupedItems.cooking.map(item => renderOrderItemCard(item))}
                          </div>
                        </div>
                      )}

                      {/* Cooked Section */}
                      {groupedItems.cooked.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full inline-block mb-2">
                            ✅ ĐÃ XONG ({groupedItems.cooked.length})
                          </h4>
                          <div className="space-y-2">
                            {groupedItems.cooked.map(item => renderOrderItemCard(item))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Summary */}
                {orderItems.length > 0 && (
                  <div className="bg-secondary-50 rounded-lg p-3 space-y-1.5 flex-shrink-0">
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-secondary-900">
                        {subtotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Thuế 12%</span>
                      <span className="font-semibold text-secondary-900">
                        {Math.round(tax).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-secondary-200">
                      <span className="font-bold text-secondary-900">Tổng</span>
                      <span className="text-base font-bold text-primary-600">
                        {Math.round(total).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Add Item Button */}
              <div className="flex flex-col space-y-3 overflow-hidden">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsAddItemOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Thêm Món
                </Button>

                {/* Summary Card */}
                {orderItems.length > 0 && (
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <h4 className="font-bold text-primary-900 mb-3">Thống Kê</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-primary-700">Chờ nấu</span>
                        <span className="font-bold text-primary-900">{groupedItems.waiting.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-700">Đang nấu</span>
                        <span className="font-bold text-primary-900">{groupedItems.cooking.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-700">Đã xong</span>
                        <span className="font-bold text-primary-900">{groupedItems.cooked.length}</span>
                      </div>
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
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => setIsAddItemOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Gọi Thêm Món
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WaiterOrderModal

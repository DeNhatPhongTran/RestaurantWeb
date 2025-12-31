import { ChefHat, Plus, Trash2, ShoppingCart, Edit2, Clock, CheckCircle2, Hourglass, Lock} from 'lucide-react'
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)


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

      const newOrderItems = selectedItems.map(item => ({
        _id: Date.now(),
        item: item.menuItem,
        quantity: item.quantity,
        note: item.note || '',
        price_at_time: item.menuItem.price,
        status: 'waiting',
        serving_status: 'unserved',
        ordered_at: new Date().toISOString()
      }));

      setOrderItems(prevItems => [...prevItems, ...newOrderItems]);

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
        // Nếu API thành công, bạn có thể làm gì đó như đóng modal
        setIsAddItemOpen(false);
      } else {
        setOrderItems(prevItems => prevItems.filter(item => !newOrderItems.includes(item)));
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
        className={`rounded-lg border-2 p-3 transition-all flex flex-col
        ${isEditing
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-100 bg-white hover:border-secondary-200'
          }`}
      >
        {isEditing ? (
          /* ================= EDIT MODE ================= */
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold text-secondary-700 mb-1 block">
                Số lượng
              </label>
              <input
                type="number"
                min="1"
                value={editData.quantity}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    quantity: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary-700 mb-1 block">
                Ghi chú
              </label>
              <input
                type="text"
                value={editData.note}
                onChange={(e) =>
                  setEditData({ ...editData, note: e.target.value })
                }
                className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleSaveEdit(item._id)}
                className="flex-1 bg-primary-500 text-white py-1.5 rounded text-xs font-semibold hover:bg-primary-600"
              >
                Lưu
              </button>
              <button
                onClick={() => setEditingItemId(null)}
                className="flex-1 bg-secondary-200 text-secondary-700 py-1.5 rounded text-xs font-semibold hover:bg-secondary-300"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          /* ================= DISPLAY MODE ================= */
          <>
            {/* HEADER: NAME + QUANTITY */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-sl text-secondary-900 line-clamp-2">
                {item.item?.name || 'Không xác định'}
              </p>

              {/* QUANTITY BADGE */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2
                rounded-md border border-primary-300 bg-primary-50
                text-primary-700 text-xs font-bold">
                  x{item.quantity}
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py rounded-full font-semibold
                ${item.status === 'waiting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : item.status === 'cooking'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}
              >
                {item.status === 'waiting' && <Hourglass className="w-3 h-3" />}
                {item.status === 'cooking' && <ChefHat className="w-3 h-3" />}
                {item.status === 'cooked' && <CheckCircle2 className="w-3 h-3" />}
                <span>
                  {item.status === 'waiting'
                    ? 'Chờ nấu'
                    : item.status === 'cooking'
                      ? 'Đang nấu'
                      : 'Hoàn thành'}
                </span>
              </span>
            </div>

            {/* PRICE + TIME */}
            <div className="flex justify-between items-center text-xs mb-1">
              {/* <span className="font-semibold text-primary-600">
                {(item.price_at_time * item.quantity).toLocaleString('vi-VN')}₫
              </span> */}

              {item.ordered_at && (
                <span className="flex items-center gap-1 text-secondary-500 ml-auto">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.ordered_at)}
                </span>
              )}
            </div>

            {/* NOTE */}
            {item.note && (
              <p className="text-xs text-secondary-600 italic line-clamp-2">
                {item.note}
              </p>
            )}

            {/* ACTIONS */}
            {canEdit && (
              <div className="flex gap-2 mt-auto pt-2 border-t border-secondary-100">
                <button
                  onClick={() => startEditItem(item)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs
                  text-primary-600 hover:bg-primary-50 p-1.5 rounded font-medium"
                >
                  <Edit2 className="w-3 h-3" />
                  Sửa
                </button>
                <button
                  onClick={() => setConfirmDeleteId(item._id)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs
                  text-red-600 hover:bg-red-50 p-1.5 rounded font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa
                </button>
              </div>
            )}

            {isLocked && (
              <div className="mt-2 flex items-center justify-center gap-1
              text-xs text-secondary-500 bg-secondary-50 rounded p-1">
                <Lock className="w-3 h-3" />
                Không thể chỉnh sửa
              </div>
            )}

            {confirmDeleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
                <div
                  className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-secondary-200">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-secondary-900">
                      Xác nhận xóa
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Warning box */}
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-800 font-semibold">
                        ⚠️ Hành động này không thể hoàn tác
                      </p>
                    </div>

                    <p className="text-sm text-secondary-700 mb-4">
                      Bạn có chắc chắn muốn xóa món này không?
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-2 p-3 border-t border-secondary-200 bg-secondary-50">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 bg-secondary-200 text-secondary-700 py-2 rounded text-sm font-semibold hover:bg-secondary-300"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteItem(confirmDeleteId)
                        setConfirmDeleteId(null)
                      }}
                      className="flex-1 bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    )
  }

  if (!isOpen || !table || !reservation) return null

  const subtotal = orderItems.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0)
  const tax = subtotal * 0.1
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
            title={`Gọi Món - Bàn ${table.name}`}
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
                          <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                          <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                          <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {groupedItems.cooked.map(item => renderOrderItemCard(item))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                Tổng đơn
                {orderItems.length > 0 && (
                  <div className="bg-secondary-50 rounded-lg p-3 space-y-1.5 flex-shrink-0">
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-secondary-900">
                        {subtotal.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-secondary-600">
                      <span>Thuế 10%</span>
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
            {/* <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => setIsAddItemOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Gọi Thêm Món
            </Button> */}
          </div>
        </div>
      </div>
    </>


  )
}
export default WaiterOrderModal

import React, { useState, useEffect, useContext } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useApi } from '../context/ApiContext'
import ChefOrderCard from '../components/table-management/ChefOrderCard'

export default function KitchenOrder() {
  const { apiCall } = useApi();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orders, setOrders] = useState({
    waiting: [],
    cooking: [],
    cooked: []
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      setError(null)
      const response = await apiCall('/api/orderitems/chef/orders', {
        method: 'GET'
      })

      if (response.success) {
        setOrders(response.data.data)
        console.log("orders", orders)
      } else {
        setError(response.message || 'Failed to fetch orders')
      }
    } catch (err) {
      setError(err.message || 'Error loading orders')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdating(true)
    try {
      // Find the item to check current status
      let item = orders.waiting.find(o => o._id === itemId)
      if (!item) item = orders.cooking.find(o => o._id === itemId)
      if (!item) item = orders.cooked.find(o => o._id === itemId)

      // Prevent invalid status transitions
      // Cannot go back to waiting or cooking from cooked
      if (item && item.serving_status === 'served') {
        setError('Không thể cập nhật trạng thái nấu ăn khi món đã phục vụ')
        setUpdating(false)
        return
      }

      const response = await apiCall(`/api/orderitems/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })

      if (response.success) {
        // Refresh orders after update
        await fetchOrders()
      } else {
        setError(response.message || 'Failed to update order')
      }
    } catch (err) {
      setError(err.message || 'Error updating order')
      console.error('Update error:', err)
    } finally {
      setUpdating(false)
    }
  }

  const renderSection = (title, items, icon) => {
    const isEmpty = items.length === 0

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-lg font-bold text-gray-900">
            {title} <span className="text-sm font-normal text-gray-500">({items.length})</span>
          </h2>
        </div>

        {isEmpty ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600">Không có món trong danh mục này</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ChefOrderCard
                key={item._id}
                orderItem={item}
                onStatusChange={handleStatusChange}
                availableStatuses={['waiting', 'cooking', 'cooked']}
                isWaiterView={false}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 text-blue-600 animate-spin" size={48} />
          <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chế biến</h1>
              <p className="text-gray-600 text-sm mt-1">Tiếp nhận và chế biến các món ăn</p>
            </div>
            <button
              onClick={() => {
                setLoading(true)
                fetchOrders()
              }}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} />
              Làm Mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">Lỗi</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Waiting Section - Priority */}
        {renderSection(
          'Chờ Nấu',
          orders.waiting,
          '⏳'
        )}

        {/* Cooking Section */}
        {renderSection(
          'Đang Nấu',
          orders.cooking,
          '🍳'
        )}

        {/* Cooked Section */}
        {renderSection(
          'Đã Nấu Xong',
          orders.cooked,
          '✅'
        )}

        {/* No Orders Message */}
        {orders.waiting.length === 0 &&
          orders.cooking.length === 0 &&
          orders.cooked.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600 text-lg font-medium">Tất cả đơn hàng đã xong</p>
              <p className="text-gray-500 text-sm">Bếp hiện đang rảnh rỗi</p>
            </div>
          )}
      </div>

      {/* Updating Indicator */}
      {updating && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <RefreshCw size={16} className="animate-spin" />
          <span>Đang cập nhật...</span>
        </div>
      )}
    </div>
  )
}

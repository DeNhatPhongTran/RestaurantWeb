import React, { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useApi } from '../context/ApiContext'
import WaiterOrderCard from '../components/table-management/WaiterOrderCard'

export default function StaffDelivery() {
    const { apiCall } = useApi()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [orders, setOrders] = useState({ unserved: [], served: [] })
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchOrders = async () => {
        try {
            setError(null)
            const response = await apiCall('/api/orderitems/waiter/delivery', { method: 'GET' })
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

    // Update trạng thái món và refetch state
    const handleStatusChange = async (itemId, newStatus) => {
        setUpdating(true)
        try {
            let item = orders.unserved.find(o => o._id === itemId)
            if (!item) item = orders.served.find(o => o._id === itemId)

            if (item && item.status !== 'cooked') {
                setError('Không thể cập nhật trạng thái nấu ăn chưa được nấu')
                setUpdating(false)
                return
            }

            const response = await apiCall(`/api/orderitems/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serving_status: newStatus })
            })

            if (response.success) {
                // Refresh orders after update
                await fetchOrders()
            } else {
                setError(response.message || 'Failed to update order')
            }
        } catch (err) {
            console.error(err)
            setError(err.message || 'Lỗi khi cập nhật đơn hàng')
            fetchOrders()
        } finally {
            setUpdating(false)
        }
    }


    const renderSection = (title, items) => {
        const isEmpty = items.length === 0
        return (
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {title} <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h2>
                {isEmpty ? (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-gray-600">Không có món trong danh mục này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(item => (
                            <WaiterOrderCard
                                key={item._id} // mỗi item chỉ xuất hiện một lần trong section
                                orderItem={item}
                                onStatusChange={handleStatusChange}
                                isWaiterView={true}
                                availableStatuses={item.status === 'cooked' ? ['served'] : []}
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
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Giao Món</h1>
                        <p className="text-gray-600 text-sm mt-1">Quản lý phục vụ đơn hàng</p>
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
                {renderSection('Chưa Phục Vụ', orders.unserved)}
                {renderSection('Đã Phục Vụ', orders.served)}
            </div>
        </div>
    )
}

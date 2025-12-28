import React, { useState, useEffect, useMemo } from 'react'
import { Loader, RefreshCw, AlertCircle } from 'lucide-react'
import { useApi } from '../context/ApiContext'
import InvoiceCard from '../components/orders/InvoiceCard'
import InvoiceDetailModal from '../components/orders/InvoiceDetailModal'
import { Button } from '../components/ui/button'
import { getUserInfo } from '../data/LocalStorage.jsx'

const InvoicePage = () => {
  const { apiCall } = useApi()
  const [unpaidInvoices, setUnpaidInvoices] = useState([])
  const [paidInvoices, setPaidInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const userInfo = useMemo(() => getUserInfo(), [])

  const fetchInvoices = async () => {
    try {
      setError('')
      const [unpaidRes, paidRes] = await Promise.all([
        apiCall('/api/invoices/cashier/unpaid', { method: 'GET' }),
        apiCall('/api/invoices/cashier/paid', { method: 'GET' })
      ])

      console.log(unpaidRes)
      if (unpaidRes.success) {
        setUnpaidInvoices(Array.isArray(unpaidRes.data.data) ? unpaidRes.data.data : [])
      }
      if (paidRes.success) {
        setPaidInvoices(Array.isArray(paidRes.data.data) ? paidRes.data.data : [])
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải dữ liệu hóa đơn')
      console.error('Error fetching invoices:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchInvoices()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchInvoices()
  }

  const handleCardClick = (invoice) => {
    setSelectedInvoice(invoice)
    setShowModal(true)
  }

  const handlePaymentSuccess = () => {
    fetchInvoices()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Đang tải dữ liệu hóa đơn...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">💳 Quản lý Thanh Toán</h1>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Tự động làm mới</span>
              </label>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 flex gap-2 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Unpaid Invoices Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">◉</span>
              {' '}
              Hóa đơn chưa thanh toán
              <span className="ml-auto text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {unpaidInvoices.length}
              </span>
            </h2>
          </div>

          {unpaidInvoices.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-gray-400 text-lg font-medium">✓ Không có hóa đơn chưa thanh toán</div>
              <p className="text-sm text-gray-500 mt-1">Tất cả khách hàng đã thanh toán</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpaidInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice._id}
                  invoice={invoice}
                  onCardClick={() => handleCardClick(invoice)}
                  isPaid={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* Paid Invoices Section */}
        <section className="pt-8 border-t">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              {' '}
              Hóa đơn đã thanh toán
              <span className="ml-auto text-lg font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {paidInvoices.length}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Hiển thị 20 hóa đơn gần đây</p>
          </div>

          {paidInvoices.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-gray-400 text-lg font-medium">○ Chưa có hóa đơn thanh toán</div>
              <p className="text-sm text-gray-500 mt-1">Các hóa đơn đã thanh toán sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paidInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice._id}
                  invoice={invoice}
                  onCardClick={() => handleCardClick(invoice)}
                  isPaid={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedInvoice(null)
        }}
        invoice={selectedInvoice}
        onPaymentSuccess={handlePaymentSuccess}
        userInfo={userInfo}
      />
    </div>
  )
}

export default InvoicePage

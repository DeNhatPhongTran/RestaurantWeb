import { AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const DeleteReservationConfirmModal = ({
  isOpen,
  onClose,
  reservation,
  onConfirmDelete,
}) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen || !reservation) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirmDelete(reservation._id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (iso) => {
    const d = new Date(iso)
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Xóa Đơn Đặt Bàn"
            icon={AlertTriangle}
            onClose={onClose}
          />

          {/* Content */}
          <div className="p-6">
            {/* ⚠️ Warning – GIỐNG DeleteTable */}
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Cảnh báo: Hành động này không thể hoàn tác
              </p>
            </div>

            {/* Main content box – GIỐNG DeleteTable */}
            <div className="mb-6">
              <p className="text-secondary-700 mb-4">
                Bạn có chắc chắn muốn xóa đơn đặt bàn này?
              </p>

              <div className="bg-secondary-50 rounded-lg p-4 space-y-2">
                <InfoRow label="Khách hàng" value={reservation.customer_name} />
                <InfoRow
                  label="Số điện thoại"
                  value={reservation.customer_phone || '—'}
                />
                <InfoRow
                  label="Số khách"
                  value={reservation.guest_count}
                />
                <InfoRow
                  label="Check-in"
                  value={formatDateTime(reservation.datetime_checkin)}
                />
                <InfoRow
                  label="Bàn"
                  value={
                    reservation.tables?.map(t => t.name).join(', ') || '—'
                  }
                />
              </div>
            </div>
          </div>

          {/* Footer – GIỐNG DeleteTable */}
          <div className="flex gap-3 p-4 border-t border-secondary-200 bg-secondary-50">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button
              size="md"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Đang Xóa...' : 'Xóa Đơn'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

/* 🔹 Row hiển thị giống DeleteTable */
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-secondary-600">{label}</span>
    <span className="font-semibold text-secondary-900 text-right">
      {value}
    </span>
  </div>
)

export default DeleteReservationConfirmModal

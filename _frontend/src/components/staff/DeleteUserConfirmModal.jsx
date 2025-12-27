import { AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const DeleteUserConfirmModal = ({ isOpen, onClose, user, onConfirmDelete }) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen || !user) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirmDelete()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Xóa Nhân Viên"
            icon={AlertTriangle}
            onClose={onClose}
          />

          {/* Content */}
          <div className="p-6">
            <div className="mb-4 p-4 rounded-lg bg-danger-50 border border-danger-200">
              <p className="text-sm text-danger-800 font-semibold">
                ⚠️ Cảnh báo: Hành động này không thể hoàn tác
              </p>
            </div>

            <div className="mb-6">
              <p className="text-secondary-700 mb-4">
                Bạn có chắc chắn muốn xóa nhân viên này?
              </p>
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary-600">Tên</span>
                  <span className="font-semibold text-secondary-900">{user.fullname}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary-600">Tài Khoản</span>
                  <span className="font-semibold text-secondary-900">{user.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Chức Vụ</span>
                  <span className="font-semibold text-secondary-900">
                    {user.role?.role_name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
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
              variant="primary"
              size="md"
              className="flex-1 bg-danger-600 hover:bg-danger-700 text-white"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Đang Xóa...' : 'Xóa Nhân Viên'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteUserConfirmModal

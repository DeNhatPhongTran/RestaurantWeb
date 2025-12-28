import { AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const DeleteTableConfirmModal = ({ isOpen, onClose, table, onConfirmDelete }) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen || !table) return null

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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Xóa Bàn" icon={AlertTriangle} onClose={onClose} />

          <div className="p-6">
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Cảnh báo: Hành động này không thể hoàn tác
              </p>
            </div>

            <div className="mb-6">
              <p className="text-secondary-700 mb-4">Bạn có chắc chắn muốn xóa bàn này?</p>
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary-600">Tên Bàn</span>
                  <span className="font-semibold text-secondary-900">{table.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Sức Chứa</span>
                  <span className="font-semibold text-secondary-900">{table.capacity} chỗ</span>
                </div>
              </div>
            </div>
          </div>

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
              variant="primary"
              size="md"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Đang Xóa...' : 'Xóa Bàn'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteTableConfirmModal

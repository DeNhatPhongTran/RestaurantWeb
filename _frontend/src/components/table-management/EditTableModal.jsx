import React, { useState, useEffect } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const EditTableModal = ({ isOpen, onClose, table, onSave }) => {
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (table) {
      setName(table.name || '')
      setCapacity(table.capacity || 2)
    }
  }, [table, isOpen])

  if (!isOpen || !table) return null

  const handleSubmit = async () => {
    setError('')

    if (!name.trim()) {
      setError('Vui lòng nhập tên bàn')
      return
    }
    if (capacity < 1) {
      setError('Sức chứa phải >= 1')
      return
    }

    setLoading(true)
    try {
      await onSave({
        name: name.trim().toUpperCase(),
        capacity: parseInt(capacity),
      })
    } catch (err) {
      setError('Lỗi khi cập nhật bàn')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Chỉnh Sửa Bàn" icon={null} onClose={handleClose} />

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Tên Bàn <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="VD: A1, B5, C3"
                className="w-full px-4 py-2 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Sức Chứa <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 p-4 border-t border-secondary-200 bg-secondary-50">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTableModal

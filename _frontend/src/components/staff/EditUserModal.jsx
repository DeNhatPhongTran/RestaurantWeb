import React, { useState, useEffect } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const EditUserModal = ({ isOpen, onClose, user, roles = [], onSave }) => {
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [state, setState] = useState('working')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '')
      setPhone(user.phone || '')
      setRole(user.role?._id || '')
      setState(user.state || 'working')
    }
  }, [user, isOpen])

  if (!isOpen || !user) return null

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!fullname.trim()) {
      setError('Vui lòng nhập tên nhân viên')
      return
    }
    if (!role) {
      setError('Vui lòng chọn chức vụ')
      return
    }

    setLoading(true)
    try {
      await onSave({
        fullname: fullname.trim(),
        phone: phone.trim() || '',
        role,
        state,
      })
    } catch (err) {
      setError('Lỗi khi cập nhật nhân viên. Vui lòng thử lại.')
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <ModalHeader
            title="Chỉnh Sửa Nhân Viên"
            icon={null}
            onClose={handleClose}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-danger-50 border border-danger-200">
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            {/* Username (Read-only) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Tên Tài Khoản
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 bg-secondary-100 text-secondary-700 cursor-not-allowed"
              />
              <p className="text-xs text-secondary-500 mt-1">Không thể chỉnh sửa tên tài khoản</p>
            </div>

            {/* Role */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Chức Vụ <span className="text-danger-600">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">-- Chọn chức vụ --</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Trạng Thái
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
              >
                <option value="working">Đang Làm Việc</option>
                <option value="off_work">Nghỉ Làm Việc</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
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

export default EditUserModal

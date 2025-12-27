import { RefreshCcw, Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { ModalHeader } from '../common'
import { Button } from '../ui/button'

const CreateUserModal = ({ isOpen, onClose, roles = [], onCreateUser }) => {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(roles[0]?._id || '')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Generate random password (10 characters)
  const generateRandomPassword = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!fullname.trim()) {
      setError('Vui lòng nhập tên nhân viên')
      return
    }
    if (!username.trim()) {
      setError('Vui lòng nhập tên tài khoản')
      return
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      return
    }
    if (!role) {
      setError('Vui lòng chọn chức vụ')
      return
    }

    setLoading(true)
    try {
      await onCreateUser({
        fullname: fullname.trim(),
        username: username.trim(),
        password: password.trim(),
        phone: phone.trim() || '',
        role,
      })

      // Reset form
      setFullname('')
      setUsername('')
      setPassword('')
      setPhone('')
      setRole(roles[0]?._id || '')
    } catch (err) {
      setError('Lỗi khi tạo nhân viên. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFullname('')
    setUsername('')
    setPassword('')
    setPhone('')
    setRole(roles[0]?._id || '')
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
            title="Tạo Nhân Viên Mới"
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

            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Tên Nhân Viên <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Nhập tên nhân viên"
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Tên Tài Khoản <span className="text-danger-600">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản"
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Mật Khẩu <span className="text-danger-600">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hoặc bấm tạo ngẫu nhiên"
                    className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600 hover:text-secondary-900"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  className="px-4 flex items-center gap-2 whitespace-nowrap"
                  onClick={generateRandomPassword}
                  type="button"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Tạo
                </Button>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Số Điện Thoại <span className="text-secondary-400">(Tùy chọn)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:border-primary-500 focus:outline-none transition-colors"
              />
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
              {loading ? 'Đang Tạo...' : 'Tạo Nhân Viên'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateUserModal

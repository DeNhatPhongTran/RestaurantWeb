import { Edit, Trash2 } from 'lucide-react'
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../ui/button'

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with role badge */}
      <div className="bg-primary-50 px-4 py-3 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-secondary-900 line-clamp-1">
            {user.fullname}
          </h3>
          <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
            {user.role?.role_name || 'N/A'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Username */}
        <div className="mb-2">
          <p className="text-xs text-secondary-600 uppercase tracking-wide">Tên Tài Khoản</p>
          <p className="text-sm font-semibold text-secondary-900">{user.username}</p>
        </div>

        {/* ID */}
        <div className="mb-4">
          <p className="text-xs text-secondary-600 uppercase tracking-wide">ID Nhân Viên</p>
          <p className="text-xs font-mono text-secondary-700 truncate">{user._id}</p>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              user.state === 'working'
                ? 'bg-success-100 text-success-700'
                : 'bg-warning-100 text-warning-700'
            }`}
          >
            {user.state === 'working' ? 'Đang Làm Việc' : 'Nghỉ Làm Việc'}
          </span>
        </div>

        {/* Phone */}
        {user.phone && (
          <div className="mb-4">
            <p className="text-xs text-secondary-600 uppercase tracking-wide">Số Điện Thoại</p>
            <p className="text-sm text-secondary-700">{user.phone}</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-secondary-200 my-4"></div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2 border-danger-300 text-danger-600 hover:bg-danger-50"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserCard

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    phone: PropTypes.string,
    state: PropTypes.string,
    role: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      role_name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

import React from 'react'
import { Avatar } from '../ui/Avatar'
import clsx from 'clsx'

const UserMenu = ({ userName, userRole, userInitial, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors"
      >
        <Avatar initials={userInitial} size="sm" />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-secondary-900">{userName}</div>
          <div className="text-xs text-secondary-500">{userRole}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-secondary-200 shadow-lg">
          <button
            onClick={() => {
              onLogout()
              setIsOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu

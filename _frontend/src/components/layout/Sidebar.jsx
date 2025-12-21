import clsx from 'clsx'
import { Bell, Calendar, Clock, Cloud, File, Package, Store } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserMenu from '../common/UserMenu'

const Header = ({ onLogout, userRole, onRoleSwitch }) => {
  const location = useLocation()

  const navItems = [
    { icon: Store, label: 'Tổng Quan', href: '/', exact: true },
    { icon: File, label: 'Đơn Hàng', href: '/orders' },
    { icon: Store, label: 'Bàn', href: '/tables' },
    { icon: Calendar, label: 'Đặt Bàn', href: '/reservations' },
    { icon: Clock, label: 'Lịch Sử', href: '/history' },
    { icon: Package, label: 'Kho', href: '/inventory' },
  ]

  const isActive = (href, exact) => {
    if (exact) return location.pathname === href
    return location.pathname.startsWith(href)
  }

  return (
    <header className="h-16 bg-white border-b border-secondary-200 flex items-center px-6 shadow-sm">
      {/* Cloud Icon */}
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg">
          <Cloud className="h-8 w-8 text-sky-400" strokeWidth={1.5} />
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-secondary-900 text-white'
                    : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right side - Notification and User */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 rounded-lg hover:bg-secondary-50 transition-colors">
          <Bell className="h-5 w-5 text-secondary-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger-500 rounded-full" />
        </button>
        <UserMenu
          userName="Richardo"
          userRole={userRole === 'cashier' ? 'Thu Ngân' : 'Phục Vụ'}
          userInitial="R"
          onLogout={onLogout}
          currentRole={userRole}
          onRoleSwitch={onRoleSwitch}
        />
      </div>
    </header>
  )
}

export default Header

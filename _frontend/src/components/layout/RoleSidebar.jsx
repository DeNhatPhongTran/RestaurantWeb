// src/components/layout/RoleSidebar.jsx

import React, { useMemo, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  Clock,
  File,
  FileText,
  LogOut,
  LogIn,
  Package,
  Store,
  Users,
  UtensilsCrossed,
  Bell,
  Contact,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { getPermission } from '@/utils/rolePermissions'
import { getUserInfo, removeUserInfo } from '../../data/LocalStorage.jsx'

const ICONS = {
  Store,
  Users,
  File,
  Calendar,
  FileText,
  Clock,
  Package,
  BarChart: BarChart3,
  UtensilsCrossed,
  Bell,
}

const RoleSidebar = ({ onLogout = null }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const userInfo = useMemo(() => getUserInfo(), [])
  const roleName = userInfo?.role?.role_name
  const isGuest = !roleName

  const permission = isGuest ? null : getPermission(roleName)

  const navItems = isGuest
    ? [
        { label: 'Trang chủ', href: '/home', icon: 'Store' },
        { label: 'Menu', href: '/menu', icon: 'UtensilsCrossed' },
      ]
    : permission?.navItems || []

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === href
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const handleLogout = () => {
    removeUserInfo()
    localStorage.removeItem('token')
    setIsSidebarOpen(false)
    onLogout?.()
    navigate('/login')
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 mt-2">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">Restaurant Page</span>
            {!isGuest && (
              <span className="text-xs text-gray-500">
                {permission?.label}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {navItems.length > 0 && (
        <>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = ICONS[item.icon]
                  const active = isActive(item.href)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link to={item.href} className="w-full">
                        <SidebarMenuButton isActive={active}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
        </>
      )}

      <SidebarFooter>
        <div className="px-2 py-3 border-t">
          <div className="text-xl font-semibold text-center mb-2">
            Dành cho nhân viên
          </div>

          {isGuest ? (
            <Button
              size="sm"
              className="w-full bg-orange-500"
              onClick={handleLoginRedirect}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="icon"
                  className="bg-orange-500 text-white"
                  onClick={() => navigate('/profile')}
                >
                  <Contact className="h-4 w-4" />
                </Button>

                <div className="text-xs min-w-0">
                  <p className="font-semibold truncate">
                    {userInfo?.fullname}
                  </p>
                  <p className="text-gray-500 truncate">
                    {userInfo?.phone || ''}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Đăng Xuất
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default RoleSidebar

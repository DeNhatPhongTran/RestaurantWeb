// src/components/layout/RoleSidebar.jsx

import React, { useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { getPermission } from '@/utils/rolePermissions';

// Icon mapping
const ICONS = {
  Store: Store,
  Users: Users,
  File: File,
  Calendar: Calendar,
  FileText: FileText,
  Clock: Clock,
  Package: Package,
  BarChart: BarChart3,
  UtensilsCrossed: UtensilsCrossed,
  Bell: Bell,
};

const RoleSidebar = ({ onLogout = null, hiddenMenuItems = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Lấy user info từ localStorage
  const userInfo = useMemo(() => {
    try {
      const data = localStorage.getItem('userInfo');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing userInfo:', error);
      return null;
    }
  }, []);

  const roleName = userInfo?.role?.role_name;

  // Nếu không phải staff (guest), chỉ hiển thị login button
  const isGuest = !userInfo;
  const permission = isGuest ? null : getPermission(roleName);

  const navItems = isGuest
    ? [
      { label: 'Trang chủ', href: '/home', icon: 'Store' },
      { label: 'Menu', href: '/menu', icon: 'UtensilsCrossed' },
    ]
    : permission?.navItems || [];

  // Kiểm tra item nào active
  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === href;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setIsSidebarOpen(false);
    onLogout?.();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 mt-2">
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-black-1000">Restaurant Page</span>
            <span className="text-xs text-gray-500">{permission?.label}</span>
          </div>
        </div>
        <div className="px-2 border-t border-sidebar-border"> </div>

      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation Items - only show if not hidden */}
      {navItems.length > 0 && (
        <>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => {
                  const IconComponent = ICONS[item.icon];
                  const active = isActive(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link to={item.href} className="w-full">
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {IconComponent && (
                              <IconComponent className="h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="truncate">{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarSeparator />
        </>
      )}

      {/* Footer - User Info & Logout */}
      <SidebarFooter>
        <div className="px-2 py-3 border-t border-sidebar-border">
          <div className="text-xm font-semibold text-center text-black-800 mb-2">Dành cho nhân viên</div>

          {isGuest ? (
            <Button
              variant="default"
              size="sm"
              className="w-full bg-orange-500 justify-center gap-2 text-black-1000 hover:text-white-700 hover:bg-orange-700"
              onClick={handleLoginRedirect}
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Button>
          ) : (
            <>
              <div className="text-xs text-gray-600 mb-2 mt-2">
                <p className="font-semibold truncate">{userInfo?.fullname}</p>
                <p className="text-gray-500">{userInfo?.phone || ''}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
  );
};

export default RoleSidebar;

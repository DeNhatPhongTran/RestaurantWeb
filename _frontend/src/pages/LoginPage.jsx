import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Xóa error khi người dùng nhập
  const handleInputChange = (e, setter) => {
    setError('');
    setter(e.target.value);
  };

  // Logic đăng nhập cho nhân viên
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username.trim(),
        password
      });

      if (response.data.success) {
        // Lưu thông tin user + token vào localStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Điều hướng dựa trên vai trò
        const role = response.data.user.role?.role_name;
        console.log('User role:', role);
        
        // Điều hướng theo vai trò
        switch (role) {
          case 'manager':
            navigate('/admin/dashboard');
            break;
          case 'waiter':
            navigate('/waiter/reservations');
            break;
          case 'chef':
            navigate('/chef/orders');
            break;
          case 'cashier':
            navigate('/cashier/invoices');
            break;
          default:
            navigate('/home');
        }
      } else {
        setError(response.data.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Lỗi kết nối đến server';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logic đăng nhập khách (guest)
  const handleGuestLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify({ 
      role: { role_name: 'guest' } 
    }));
    navigate('/home');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl">🍽️ Quản Lý Nhà Hàng</CardTitle>
          <p className="text-center text-sm text-blue-100 mt-2">Hệ thống quản lý nhà hàng</p>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="staff">👨‍💼 Nhân viên</TabsTrigger>
              <TabsTrigger value="guest">👤 Khách</TabsTrigger>
            </TabsList>

            {/* Tab đăng nhập nhân viên */}
            <TabsContent value="staff">
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Tên đăng nhập
                  </label>
                  <Input 
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => handleInputChange(e, setUsername)}
                    disabled={loading}
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Mật khẩu
                  </label>
                  <Input 
                    type="password" 
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword)}
                    disabled={loading}
                    className="border-gray-300"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? '⏳ Đang đăng nhập...' : '🔓 Đăng nhập'}
                </Button>

                <div 
                  className="text-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer transition"
                  onClick={() => navigate('/forgot-password')}
                >
                  ❓ Quên mật khẩu?
                </div>
              </form>

              {/* Test accounts info */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-gray-700">
                <p className="font-semibold mb-2">📝 Tài khoản test:</p>
                <ul className="space-y-1">
                  <li><strong>Manager:</strong> manager1 / 123</li>
                  <li><strong>Waiter:</strong> waiter1 / 123</li>
                  <li><strong>Chef:</strong> chef1 / 123</li>
                  <li><strong>Cashier:</strong> cashier1 / 123</li>
                </ul>
              </div>
            </TabsContent>

            {/* Tab đăng nhập khách */}
            <TabsContent value="guest">
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Đăng nhập tư cách khách để xem thực đơn và đặt bàn.
                </p>
                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  👋 Tiếp tục với tư cách Khách
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
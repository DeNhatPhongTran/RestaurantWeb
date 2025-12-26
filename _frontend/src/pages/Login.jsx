import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginForm } from '../components/login-form';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username.trim(),
        password
      });

      if (response.data.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        const role = response.data.user.role?.role_name;
        console.log('User role:', role);
        navigate('/home');
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

  const handleGuestLogin = () => {
    localStorage.setItem('userInfo', JSON.stringify({ 
      role: { role_name: 'guest' } 
    }));
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544145945-f90425340c7b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/70 to-amber-50/60" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:items-start lg:gap-14">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 shadow-sm ring-1 ring-orange-100">
            Đội TasteGood
          </span>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Quản lý TasteGood dễ dàng
          </h1>
          <p className="text-lg text-muted-foreground">
            Đăng nhập để theo dõi các đặt phòng, cập nhật thực đơn và hỗ trợ khách hàng trong vài giây.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/85 p-4 text-left shadow-lg ring-1 ring-orange-100 backdrop-blur">
              <p className="text-sm font-semibold text-amber-700">Tổng quan về đặt bàn</p>
              <p className="text-sm text-muted-foreground">Xem trạng thái đặt chỗ và yêu cầu đặc biệt trong tích tắc.</p>
            </div>
            <div className="rounded-2xl bg-white/85 p-4 text-left shadow-lg ring-1 ring-orange-100 backdrop-blur">
              <p className="text-sm font-semibold text-amber-700">Kiểm soát thực đơn</p>
              <p className="text-sm text-muted-foreground">Cập nhật các món ăn và khuyến mãi mà không làm gián đoạn dịch vụ.</p>
            </div>
            <div className="rounded-2xl bg-white/85 p-4 text-left shadow-lg ring-1 ring-orange-100 backdrop-blur sm:col-span-2">
              <p className="text-sm font-semibold text-amber-700">Sẵn sàng cho nhóm</p>
              <p className="text-sm text-muted-foreground">Được xây dựng để nhân viên đăng nhập với phản hồi lỗi nhanh và hướng dẫn hữu ích.</p>
            </div>
          </div>

          {/* Guest login section */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-200">
            <p className="text-sm font-semibold text-green-700 mb-2">👤 Bạn là Khách?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Đi đến trang chủ với vai trò khách để xem thực đơn, đặt bàn và tìm hiểu thêm về nhà hàng.
            </p>
            <button
              onClick={handleGuestLogin}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
            >
              Tiếp tục với tư cách Khách
            </button>
          </div>
        </div>

        <div className="flex-1">
          <LoginForm 
            className="w-full max-w-md"
            onLogin={handleLogin}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

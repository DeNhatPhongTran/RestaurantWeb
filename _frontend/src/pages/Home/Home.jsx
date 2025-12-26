import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Footer from '../../components/Layouts/Footer'

export default function Home() {
  // const navigate = useNavigate();

  // // Lấy user info từ localStorage
  // const userInfo = useMemo(() => {
  //   try {
  //     const data = localStorage.getItem('userInfo');
  //     return data ? JSON.parse(data) : null;
  //   } catch (e) {
  //     console.error('Error parsing userInfo:', e);
  //     return null;
  //   }
  // }, []);

  // const roleName = userInfo?.role?.role_name;
  // const isStaff = roleName && roleName !== 'guest';

  return (
    <>
      {/* Staff Login Section
      {!isStaff && (
        <section className="min-h-[400px] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl w-full text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                👨‍💼 Dành cho Nhân Viên
              </h2>
              <p className="text-lg text-gray-600">
                Nếu bạn là nhân viên nhà hàng, vui lòng đăng nhập để truy cập hệ thống quản lý.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="px-8 py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                🔓 Đăng Nhập Nhân Viên
              </Button>
              <p className="text-sm text-gray-500">
                Tài khoản: manager1 / waiter1 / chef1 / cashier1 (Mật khẩu: 123)
              </p>
            </div>
          </div>
        </section>
      )} */}

      {/* Home Content Sections */}
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Footer />
    </>
  );
}

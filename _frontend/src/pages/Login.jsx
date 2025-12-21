import { LoginForm } from '../components/login-form';

export default function LoginPage() {
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
              <p className="text-sm font-semibold text-amber-700">Tổng quan về đặt phòng</p>
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
        </div>
        <div className="flex-1">
          <LoginForm className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}

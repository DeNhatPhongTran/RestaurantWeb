import { useNavigate } from 'react-router-dom';
import { useApi } from '@/context/ApiContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { user, logout } = useApi();
  const navigate = useNavigate();

  const role_translate = {
  manager: "Quản lý",
  waiter: "Phục vụ",
  chef: "Đầu bếp",
  cashier: "Thu ngân",
};


  if (!user) return <div className="p-10">Loading...</div>;

  // Helper to get initials (e.g., "manager_dave" -> "MA")
  const getInitials = (name) => name.substring(0, 2).toUpperCase();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-col items-center">
          
          {/* --- PROFILE PICTURE LOGIC --- */}
          <Avatar className="h-24 w-24 mb-4">
            {/* 1. Try to show the real image */}
            <AvatarImage src={user.avatar} alt={user.fullname} />
            
            {/* 2. If no image, show this Fallback */}
            <AvatarFallback className="bg-slate-200 text-xl font-bold">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          {/* ----------------------------- */}

          <CardTitle>Trang cá nhân</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">ID</p>
              <p className="font-mono font-bold text-xl text-orange-600">
                {user.customId || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tên</p>
            <p className="font-bold text-lg capitalize">{user.fullname}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Chức vụ</p>
            <p className="uppercase font-bold text-orange-600">{role_translate[user.role?.role_name]}</p>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" variant="outline" onClick={() => navigate('/reset_password')}>
              Thay đổi mật khẩu
            </Button>
            <Button className=" gap-2 text-red-600 hover:bg-red-600 hover:text-white"
            variant="outline" onClick={async () => {
              await logout();
              navigate('/');
            }}>
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (isGuest) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { 
        username, 
        password, 
        isGuest 
      });
      
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      if (res.data.role === 'guest') {
        navigate('/home');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      alert('Đăng nhập không thành công!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="staff">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="staff">Nhân viên</TabsTrigger>
              <TabsTrigger value="guest">Khách</TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <div className="space-y-4">
                <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <Button className="w-full" onClick={() => handleLogin(false)}>Đăng nhập</Button>
                <div className="text-center text-sm text-blue-500 cursor-pointer" onClick={() => navigate('/forgot-password')}>
                  Quên mật khẩu
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guest">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Đăng nhập để xem thực đơn của chúng tôi.</p>
                <Button className="w-full" variant="outline" onClick={() => handleLogin(true)}>
                  Tiếp tục với tư cách Khách
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
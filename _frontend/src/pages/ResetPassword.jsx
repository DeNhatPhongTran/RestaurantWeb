import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Ensure user is logged in
  useEffect(() => {
    const data = localStorage.getItem('userInfo');
    if (!data) navigate('/');
    else setUser(JSON.parse(data));
  }, []);

  const handleChangePassword = async () => {
    // 1. Client-side Validation
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không trùng khớp!");
      return;
    }

    function validatePassword(newPassword) {
        const hasSixChars = newPassword.length >= 6;
        const hasSpecialChar = /[!@#$%^<>&*~]/.test(newPassword);

    return hasSixChars && hasSpecialChar;
    }   

    function validatePassword2(newPassword) {
        const isSameAsLastPW = (newPassword != oldPassword);

    return isSameAsLastPW;
    }


    if (!validatePassword(newPassword)) {
        alert("Mật khẩu phải có ít nhất 6 kí tự và có chứa kí tự đặc biệt!");
      return;
    }

    if (!validatePassword2(newPassword)) {
        alert("Mật khẩu mới phải khác mật khẩu cũ!");
      return;
    }

    try {
      // 2. Send to Backend
      const res = await axios.post('http://localhost:5000/api/change-password', {
        userId: user._id,
        oldPassword,
        newPassword
      });
      //res.data.message
      alert("Thay đổi mật khẩu thành công!");
      // Optional: Clear storage and force re-login with new password
      localStorage.removeItem('userInfo');
      navigate('/');
      
    } catch (error) {
      // Handle "Incorrect old password" error
      const msg = error.response?.data?.message || 'Update failed';
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Thay đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-1">
            <Label>Mật khẩu cũ</Label>
            <Input 
              type="password" 
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <Label>Mật khẩu mới</Label>
            <Input 
              type="password" 
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <Label>Xác nhận mật khẩu</Label>
            <Input 
              type="password" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="w-full" onClick={handleChangePassword}>Cập nhật</Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>Quay lại</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
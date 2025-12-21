import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const handleChangePassword = async () => {
    // 1. Client-side Validation
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không trùng khớp!");
      return;
    }

  }

function validatePassword(newPassword) {
        const hasSixChars = newPassword.length >= 6;
        const hasSpecialChar = /[!@#$%^<>&*~]/.test(newPassword);

    return hasSixChars && hasSpecialChar;
    }   

export default function ForgotPassword() {
  // --- STATE VARIABLES ---
  const [step, setStep] = useState(1); // Controls which "Screen" is visible
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();

  // --- STEP 1: VERIFY IDENTITY ---
  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/verify-user', { 
        username, 
        phone 
      });
      
      if (res.data.valid) {
        setUserId(res.data.userId);
        setStep(2); // This switches the view to the Password fields
      }
    } catch (error) {
      alert('Tên đăng nhập hoặc số điện thoại không trùng khớp!');
    }
  };

  // --- STEP 2: RESET PASSWORD ---
  const handleReset = async () => {
    // 1. Check matching
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không trùng khớp.");
      return;
    }

    // 2. Check logic (Special char & length)
    if (!validatePassword(newPassword)) {
      alert("Mật khẩu phải có ít nhất 6 kí tự và có chứa kí tự đặc biệt!");
      return;
    }

    // 3. Send to Server
    try {
      await axios.post('http://localhost:5000/api/reset-password', { 
        userId, 
        newPassword 
      });
      alert('Thay đổi mật khẩu thành công!');
      navigate('/');
    } catch (error) {
      alert('Xảy ra lỗi!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Thông tin nhân viên" : "Đặt mật khẩu mới"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* --- CONDITIONAL RENDERING START --- */}
          
          {step === 1 ? (
            // SCREEN 1: Ask for Username & Phone
            <>
              <div className="space-y-1">
                <Label>Tên đăng nhập</Label>
                <Input 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label>Số điện thoại</Label>
                <Input 
                  placeholder="Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <Button className="w-full mt-2" onClick={handleVerify}>
                Xác nhận thông tin
              </Button>
              <div className="text-center mt-2">
                <Button variant="link" onClick={() => navigate('/')}>
                  Quay lại Đăng nhập
                </Button>
              </div>
            </>
          ) : (
            // SCREEN 2: Ask for New Passwords
            <>
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
              <Button className="w-full mt-2" onClick={handleReset}>
                Update Password
              </Button>
            </>
          )}

          {/* --- CONDITIONAL RENDERING END --- */}

        </CardContent>
      </Card>
    </div>
  );
}
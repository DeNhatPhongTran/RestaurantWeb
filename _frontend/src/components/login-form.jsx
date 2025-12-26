import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className = '', onLogin = null, error: externalError = '', loading: externalLoading = false, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const isLoading = externalLoading || false;
  const displayError = externalError || localError;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!username.trim() || !password.trim()) {
      setLocalError("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    if (onLogin) {
      await onLogin(username, password);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 bg-white shadow-2xl ring-1 ring-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground text-center">Chào mừng quay lại</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Đăng nhập để quản lý các đặt phòng tại TasteGood và cập nhật thực đơn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input
                id="username"
                type="text"
                placeholder="manager1"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                {/* <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100" role="alert">
                {displayError}
              </p>
            )}

            <Button type="submit" className="w-full bg-amber-500 text-white hover:bg-amber-600" disabled={isLoading}>
              {isLoading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <a href="/contact"   className="ml-1 font-medium text-red-600 underline-offset-4 hover:underline hover:text-red-700">
              Liên hệ quản lý nhà hàng
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

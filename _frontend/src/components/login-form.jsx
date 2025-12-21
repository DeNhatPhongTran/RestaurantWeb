import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useApi } from "@/context/ApiContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login, loading } = useApi();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(username.trim(), password);
    if (result.success) {
      navigate("/");
      return;
    }

    setError(result.error || "Đăng nhập thất bại. Vui lòng thử lại.");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 bg-white/95 shadow-2xl ring-1 ring-orange-100/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Chào mừng quay lại</CardTitle>
          <CardDescription className="text-muted-foreground">
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
                placeholder="staff.tastegood"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-amber-500 text-white hover:bg-amber-600" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled>
              Đăng nhập bằng Google (sắp có)
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?
            <a href="#" className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
              Liên hệ quản trị viên
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

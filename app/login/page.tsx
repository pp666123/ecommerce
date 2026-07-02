"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { checkAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.login({ email, password });

      await checkAuth();

      toast.success("登入成功！", {
        description: "歡迎回來，準備開始購物吧。",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      // 安全地處理 unknown 型別的錯誤
      const errorMessage =
        error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("登入失敗", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      // 呼叫剛剛封裝好的 API
      await authApi.googleLogin({ credential: response.credential });

      await checkAuth();

      toast.success("登入成功！", { description: "歡迎回來" });
      router.push("/");
      router.refresh();
    } catch (error) {
      // 安全地處理由 fetcher 拋出的錯誤訊息
      const errorMessage =
        error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("Google 登入失敗", { description: errorMessage });
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            歡迎回來
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            請輸入您的電子郵件與密碼登入
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              電子郵件
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="hello@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                密碼
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                忘記密碼？
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black transition-all"
          >
            {isLoading ? "登入中..." : "登入"}
            {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative bg-white dark:bg-zinc-900 px-4 text-xs text-zinc-400 uppercase tracking-widest">
            Or continue with
          </div>
        </div>

        <div className="mt-6">
          <div className="relative w-full">
            {/* 1. 這是你精心設計的漂亮按鈕 (純 UI) */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl font-bold border-zinc-300 dark:border-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google 登入
            </Button>

            {/* 2. Google 的元件蓋在上面，設為完全透明，並設為絕對定位 */}
            <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden rounded-xl">
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("登入失敗")}
                  width="384px" // 確保寬度蓋滿
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          還沒有帳號嗎？{" "}
          <Link
            href="/register"
            className="font-bold text-black dark:text-white hover:underline underline-offset-4"
          >
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  );
}

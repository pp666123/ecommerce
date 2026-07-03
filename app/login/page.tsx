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
  CredentialResponse,
} from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuth } = useAuthStore();

  // 使用 FormData 讀取表單，優點：不需要為每個輸入框建立 useState，大幅減少重新渲染
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await authApi.login({ email, password });
      await checkAuth();

      toast.success("登入成功！", { description: "歡迎回來，準備開始購物吧。" });
      router.push("/");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("登入失敗", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;

    try {
      await authApi.googleLogin({ credential: response.credential });
      await checkAuth();
      toast.success("登入成功！", { description: "歡迎回來" });
      router.push("/");
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("Google 登入失敗", { description: errorMessage });
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">歡迎回來</h1>
          <p className="text-zinc-500 mt-2 text-sm">請輸入您的電子郵件與密碼登入</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">電子郵件</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="hello@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">密碼</label>
              <Link href="/forgot-password" className="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                忘記密碼？
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="password"
                name="password"
                required
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
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
          <div className="relative bg-white dark:bg-zinc-900 px-4 text-xs text-zinc-400 uppercase tracking-widest">Or continue with</div>
        </div>

        <div className="mt-6 relative w-full">
          <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-zinc-300 dark:border-zinc-800 flex items-center justify-center gap-2">
            Google 登入
          </Button>
          <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden rounded-xl">
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("登入失敗")}
                width="384px"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, Suspense } from "react";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/services/api"; // 確保你有加入 resetPassword 到 api.ts
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("無效的連結", { description: "網址中缺少驗證碼" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("密碼不一致", { description: "請確認兩次輸入的密碼相同" });
      return;
    }

    setIsLoading(true);

    try {
      // 呼叫更新密碼 API
      const response = await authApi.resetPassword({ token, newPassword: password });
      toast.success("重設成功！", { description: response.message });
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("重設失敗", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">密碼已更新</h2>
        <p className="text-zinc-500 mb-8">您的密碼已成功修改，請使用新密碼重新登入。</p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-12 rounded-xl font-bold bg-black text-white"
        >
          前往登入
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">設定新密碼</h1>
        <p className="text-zinc-500 mt-2 text-sm">請輸入您的新密碼，至少需 8 個字元並包含大小寫英文</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">新密碼</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">確認新密碼</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !password}
          className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-zinc-800 text-white transition-all mt-2"
        >
          {isLoading ? "處理中..." : "確認重設"}
          {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
        {/* Next.js 規定使用 useSearchParams 的元件需被 Suspense 包覆 */}
        <Suspense fallback={<div className="text-center py-10">載入中...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
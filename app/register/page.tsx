import Link from "next/link";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/api";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // 1. await params 處理網址列的錯誤參數
  const resolvedParams = await searchParams;
  const errorMessage = resolvedParams.error;

  // 2. 定義 Server Action 處理註冊表單
  async function handleRegister(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !email || !password) return;

    let redirectUrl = "";

    try {
      // 3. 直接呼叫 API 進行註冊
      await authApi.register({ username, email, password });

      // 註冊成功，導向登入頁面 (你可以透過 URL 參數傳遞成功訊息給 login 頁面)
      redirectUrl = "/login?registered=true";
    } catch (error) {
      // 捕捉錯誤，將訊息放到網址中返回當前頁面
      const errMsg = error instanceof Error ? error.message : "發生未知錯誤";
      redirectUrl = `/register?error=${encodeURIComponent(errMsg)}`;
    }

    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            建立帳號
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            加入我們，解鎖專屬潮流體驗
          </p>
        </div>

        {/* 錯誤訊息顯示區 */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-400">
              <span className="font-bold block">註冊失敗</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* 4. 改用 Server Action 表單 */}
        <form action={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              使用者名稱
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                name="username"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="您的稱呼"
              />
            </div>
          </div>

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
                name="email"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="hello@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              設定密碼
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                placeholder="至少 8 個字元"
              />
            </div>
          </div>

          {/* 移除 isLoading，改回純按鈕 */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black transition-all mt-2"
          >
            建立帳號
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          已經有帳號了？{" "}
          <Link
            href="/login"
            className="font-bold text-black dark:text-white hover:underline underline-offset-4"
          >
            點此登入
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authApi } from "@/services/api";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 正式呼叫 API
      const response = await authApi.forgotPassword({ email });
      
      toast.success("信件已發送！", { 
        description: response.message || "請檢查您的電子信箱，並點擊信中的連結來重設密碼。" 
      });
      setIsSent(true); // 切換狀態為已發送
    } catch (error) {
      // 這裡會精準捕捉到我們在後端寫的 "找不到信箱" 或 "第三方登入" 的錯誤訊息
      const errorMessage =
        error instanceof Error ? error.message : "發生未知錯誤";
      toast.error("發送失敗", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            忘記密碼
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            請輸入您註冊時使用的電子郵件，我們將發送重設密碼的連結給您
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleResetPassword} className="space-y-5">
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

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black transition-all mt-2"
            >
              {isLoading ? "發送中..." : "發送重設連結"}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 text-center border border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">請檢查您的信箱</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              我們已經將密碼重設連結發送至 <br/>
              <span className="font-medium text-zinc-900 dark:text-zinc-300">{email}</span>
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSent(false)}
              className="mt-6 w-full h-10 rounded-xl font-bold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              重新輸入信箱
            </Button>
          </div>
        )}

        <div className="mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          記起密碼了嗎？{" "}
          <Link
            href="/login"
            className="font-bold text-black dark:text-white hover:underline underline-offset-4"
          >
            返回登入
          </Link>
        </p>
      </div>
    </div>
  );
}
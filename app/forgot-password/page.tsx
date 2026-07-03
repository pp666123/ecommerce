import Link from "next/link";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/api";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; email?: string; error?: string }>;
}) {
  // 1. 在 Server Component 中 await params
  const resolvedParams = await searchParams;
  const isSent = resolvedParams.sent === "true";
  const submittedEmail = resolvedParams.email || "";
  const errorMessage = resolvedParams.error;

  // 2. 定義 Server Action 來處理表單送出
  async function handleResetPassword(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    
    if (!email) return;

    let redirectUrl = "";

    try {
      // 3. 直接呼叫 API Service 層的函式
      await authApi.forgotPassword({ email });
      
      // 成功後，準備導向帶有成功狀態的網址
      redirectUrl = `/forgot-password?sent=true&email=${encodeURIComponent(email)}`;
    } catch (error) {
      // 捕捉錯誤，並將錯誤訊息帶入網址
      const errMsg = error instanceof Error ? error.message : "發生未知錯誤";
      redirectUrl = `/forgot-password?error=${encodeURIComponent(errMsg)}`;
    }

    // 執行轉址 (需寫在 try-catch 外，因為 redirect 底層是 throw Error)
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

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

        {/* 若有錯誤，直接在畫面上方顯示 (取代原本的 toast) */}
        {errorMessage && !isSent && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-400">
              <span className="font-bold block">發送失敗</span>
              {errorMessage}
            </div>
          </div>
        )}

        {!isSent ? (
          // 將原本的 onSubmit 改為 action
          <form action={handleResetPassword} className="space-y-5">
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
                  defaultValue={submittedEmail}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                  placeholder="hello@gmail.com"
                />
              </div>
            </div>

            {/* 移除 isLoading 判斷，還原為最簡潔的 Server 按鈕 */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black transition-all mt-2"
            >
              發送重設連結
              <ArrowRight className="ml-2 w-4 h-4" />
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
              <span className="font-medium text-zinc-900 dark:text-zinc-300">{submittedEmail}</span>
            </p>
            {/* 改用 Server 路由導向來取代原本的 setState */}
            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full h-10 rounded-xl font-bold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              asChild
            >
              <Link href="/forgot-password">
                重新輸入信箱
              </Link>
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
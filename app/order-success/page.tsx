"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  // 可選：如果你希望結帳成功後，幾秒後自動跳轉回首頁或訂單查詢
  useEffect(() => {
    // 這裡可以加入簡單的動畫邏輯或導向計時器
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* 成功圖示 */}
        <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        {/* 標題與內文 */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            訂單已成功建立！
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            感謝您的購買，我們已經收到您的訂單。<br />
            您可以隨時在會員中心查看訂單進度。
          </p>
        </div>

        {/* 訂單摘要小卡 */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">訂單狀態</span>
            <span className="font-bold text-emerald-600">處理中</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">預計出貨日</span>
            <span className="font-medium text-zinc-900 dark:text-white">3-5 個工作天</span>
          </div>
        </div>

        {/* 按鈕組 */}
        <div className="grid gap-3">
          <Button
            asChild
            className="h-14 rounded-xl text-lg font-bold bg-black hover:bg-zinc-800 text-white"
          >
            <Link href="/collections">
              繼續逛逛 <ShoppingBag className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className="h-14 rounded-xl text-zinc-600 hover:text-black dark:text-zinc-400"
          >
            <Link href="/account/orders">
              查看訂單紀錄 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
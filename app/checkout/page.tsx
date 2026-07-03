"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Truck,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  // 優化 1：加入 isMounted 解決 Zustand 在 Next.js 渲染不一致的 Hydration 錯誤
  const [isMounted, setIsMounted] = useState(false);

  // 優化 2：加入 isSubmitting 狀態，防止重複點擊送出
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 從 Zustand Store 取出需要的狀態與方法
  const cartData = useCartStore((state) => state.cartData);
  const clearCart = useCartStore((state) => state.clearCartData);
  const delCartData = useCartStore((state) => state.delCartData);
  const updateAmount = useCartStore((state) => state.updateAmount);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // 優化 3：使用 useMemo 緩存金額計算，避免畫面重新渲染時浪費效能
  const { subtotal, shippingFee, orderTotal } = useMemo(() => {
    const sub = cartData.reduce(
      (total, item) => total + item.price * item.stock_amount,
      0,
    );
    const ship = sub > 0 ? 15 : 0;
    return { subtotal: sub, shippingFee: ship, orderTotal: sub + ship };
  }, [cartData]);

  // 處理結帳送出
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartData.length === 0) {
      toast.error("購物車是空的，無法結帳！");
      return;
    }

    setIsSubmitting(true);

    // 模擬 API 處理過程 (延遲 1.5 秒讓使用者看到處理中的狀態)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("訂單建立成功！", {
      description: "感謝您的購買，您的訂單已進入處理流程。",
    });

    if (clearCart) clearCart();
    router.push("/");
  };

  // 處理數量減少 (最低為 1)
  const handleMinus = (id: number, currentAmount: number) => {
    if (currentAmount > 1) {
      updateAmount(id, currentAmount - 1);
    }
  };

  // 處理數量增加
  const handlePlus = (id: number, currentAmount: number) => {
    updateAmount(id, currentAmount + 1);
  };

  // 處理刪除商品
  const handleDelete = (id: number, title: string) => {
    toast.success("已移除商品", {
      description: `${title} 已從結帳清單中移除。`,
    });
    delCartData(id);
  };

  // 確保元件掛載後才渲染 UI，避免 Hydration 報錯
  if (!isMounted) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-12 mt-6 md:mt-8 min-h-screen">
      {/* 頂部返回按鈕 */}
      <div className="mb-8">
        <Link
          href="/collections"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          繼續購物
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* ================= 左欄：表單區域 ================= */}
        <div className="flex-1 lg:max-w-[60%] w-full">
          <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">
            結帳
          </h1>

          <form
            id="checkout-form"
            onSubmit={handleCheckoutSubmit}
            className="space-y-10"
          >
            {/* 1. 聯絡資訊 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
                聯絡資訊
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  電子郵件
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                  placeholder="hello@gmail.com"
                />
              </div>
            </section>

            {/* 2. 運送地址 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" /> 運送地址
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    姓氏
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="王"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    名字
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="大明"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  詳細地址
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                  placeholder="信義區市府路 1 號"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    城市
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="台北市"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    郵遞區號
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                    placeholder="110"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  聯絡電話
                </label>
                <input
                  required
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                  placeholder="0912345678"
                />
              </div>
            </section>

            {/* 3. 付款方式 (視覺模擬) */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> 付款資訊
              </h2>
              <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">信用卡 / 簽帳金融卡</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                    <div className="w-8 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none text-sm"
                    placeholder="卡號 (1234 5678 9101 1121)"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none text-sm"
                      placeholder="到期日 (MM/YY)"
                    />
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none text-sm"
                      placeholder="安全碼 (CVC)"
                    />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* ================= 右欄：訂單摘要 ================= */}
        <div className="flex-1 lg:max-w-[40%] w-full">
          <div className="sticky top-24 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              訂單摘要
            </h2>

            {/* 購物車商品列表 (支援刪改) */}
            <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
              {cartData.length === 0 ? (
                <div className="text-zinc-500 text-sm py-4">
                  您的購物車目前沒有商品。
                </div>
              ) : (
                cartData.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    {/* 圖片 */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                      {/* 優化 4：加上 sizes="80px" 避免下載大圖 */}
                      <Image
                        src={item.image_url[0]}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* 資訊與操作區 */}
                    <div className="flex-1 flex flex-col justify-between min-h-[5rem]">
                      {/* 上半部：標題與價格 */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-sm text-zinc-500 mt-1">
                            ${item.price}
                          </p>
                        </div>
                        <div className="font-bold text-zinc-900 dark:text-white shrink-0">
                          ${item.price * item.stock_amount}
                        </div>
                      </div>

                      {/* 下半部：數量增減與刪除按鈕 */}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900">
                          <button
                            type="button"
                            onClick={() =>
                              handleMinus(item.id, item.stock_amount)
                            }
                            disabled={item.stock_amount <= 1}
                            className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">
                            {item.stock_amount}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handlePlus(item.id, item.stock_amount)
                            }
                            className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-zinc-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 金額計算區 */}
            <div className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>小計</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  ${subtotal}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>運費</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {shippingFee === 0 ? "免費" : `$${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 mb-8">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                總計
              </span>
              <span className="text-2xl font-bold text-black dark:text-white">
                <span className="text-sm text-zinc-500 font-normal mr-1">
                  USD
                </span>
                ${orderTotal}
              </span>
            </div>

            {/* 提交按鈕：加入 isSubmitting 判斷 */}
            <Button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || cartData.length === 0}
              className="w-full h-14 rounded-xl text-lg font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-xl shadow-black/10 dark:shadow-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? "處理中..." : "確認付款"}
            </Button>

            <p className="text-xs text-center text-zinc-500 mt-4 flex items-center justify-center gap-1">
              您的付款資訊將受到安全加密保護
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

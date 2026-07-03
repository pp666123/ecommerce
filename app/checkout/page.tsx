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
  Store,
  Wallet,
  Package,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 結帳狀態
  const [logistics, setLogistics] = useState<"home" | "711" | "family">("home");
  const [payment, setPayment] = useState<"credit_card" | "line_pay">("credit_card");
  
  // 發票狀態
  const [invoiceType, setInvoiceType] = useState<"personal" | "company">("personal");
  const [carrierType, setCarrierType] = useState<"member" | "mobile" | "paper">("member");
  // 🔥 新增：同收件人地址狀態
  const [isSameAsShipping, setIsSameAsShipping] = useState(false);

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

  const { subtotal, shippingFee, orderTotal } = useMemo(() => {
    const sub = cartData.reduce(
      (total, item) => total + item.price * item.stock_amount,
      0,
    );
    let ship = 0;
    if (sub > 0) {
      if (logistics === "home") ship = 15;
      if (logistics === "711" || logistics === "family") ship = 10;
    }
    return { subtotal: sub, shippingFee: ship, orderTotal: sub + ship };
  }, [cartData, logistics]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartData.length === 0) {
      toast.error("購物車是空的，無法結帳！");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("訂單建立成功！", {
      description: payment === "line_pay" 
        ? "正在為您導向 LINE Pay 付款頁面..." 
        : "感謝您的購買，您的訂單已進入處理流程。",
    });
    if (clearCart) clearCart();
    router.push("/");
  };

  const handleMinus = (id: number, currentAmount: number) => {
    if (currentAmount > 1) updateAmount(id, currentAmount - 1);
  };
  const handlePlus = (id: number, currentAmount: number) => {
    updateAmount(id, currentAmount + 1);
  };
  const handleDelete = (id: number, title: string) => {
    toast.success("已移除商品", { description: `${title} 已從結帳清單中移除。` });
    delCartData(id);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-12 mt-6 md:mt-8 min-h-screen">
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

          <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-10">
            {/* 1. 聯絡資訊 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
                聯絡資訊
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  電子郵件
                </label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="hello@gmail.com" />
              </div>
            </section>

            {/* 2. 物流選擇 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <Package className="w-5 h-5" /> 運送方式
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button type="button" onClick={() => setLogistics("home")} className={cn("flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left", logistics === "home" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 hover:border-zinc-300")}>
                  <Truck className="w-6 h-6 mb-2 text-zinc-700 dark:text-zinc-300" />
                  <span className="font-bold text-zinc-900 dark:text-white">宅配到府</span>
                  <span className="text-xs text-zinc-500 mt-1">運費 $15</span>
                </button>
                <button type="button" onClick={() => setLogistics("711")} className={cn("flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left", logistics === "711" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 hover:border-zinc-300")}>
                  <Store className="w-6 h-6 mb-2 text-zinc-700 dark:text-zinc-300" />
                  <span className="font-bold text-zinc-900 dark:text-white">7-11 超商取貨</span>
                  <span className="text-xs text-zinc-500 mt-1">運費 $10</span>
                </button>
                <button type="button" onClick={() => setLogistics("family")} className={cn("flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left", logistics === "family" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 hover:border-zinc-300")}>
                  <Store className="w-6 h-6 mb-2 text-zinc-700 dark:text-zinc-300" />
                  <span className="font-bold text-zinc-900 dark:text-white">全家 超商取貨</span>
                  <span className="text-xs text-zinc-500 mt-1">運費 $10</span>
                </button>
              </div>
            </section>

            {/* 3. 收件資訊與備註 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" /> 收件資訊
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">收件人姓名</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="王大明" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">聯絡電話</label>
                  <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="0912345678" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {logistics === "home" ? "詳細地址" : "超商門市名稱 / 店號"}
                </label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black outline-none transition-all" placeholder={logistics === "home" ? "信義區市府路 1 號" : "信義門市 / 123456"} />
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  訂單備註 (選填)
                </label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black outline-none transition-all resize-none" placeholder="有什麼想告訴我們的嗎？ (例如：請在平日白天送達)"></textarea>
              </div>
            </section>

            {/* 4. 發票資訊 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5" /> 發票資訊
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setInvoiceType("personal")} className={cn("p-4 rounded-xl border-2 text-center font-bold transition-all", invoiceType === "personal" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 text-zinc-500 hover:border-zinc-300")}>
                  個人發票
                </button>
                <button type="button" onClick={() => setInvoiceType("company")} className={cn("p-4 rounded-xl border-2 text-center font-bold transition-all", invoiceType === "company" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 text-zinc-500 hover:border-zinc-300")}>
                  公司發票 (統編)
                </button>
              </div>

              {/* 個人發票：選擇載具 */}
              {invoiceType === "personal" && (
                <div className="space-y-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">選擇載具類型</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setCarrierType("member")} className={cn("py-2 px-1 text-sm rounded-lg border transition-all font-medium", carrierType === "member" ? "border-black bg-black text-white dark:bg-white dark:text-black" : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800")}>
                      會員載具
                    </button>
                    <button type="button" onClick={() => setCarrierType("mobile")} className={cn("py-2 px-1 text-sm rounded-lg border transition-all font-medium", carrierType === "mobile" ? "border-black bg-black text-white dark:bg-white dark:text-black" : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800")}>
                      手機條碼
                    </button>
                    <button type="button" onClick={() => setCarrierType("paper")} className={cn("py-2 px-1 text-sm rounded-lg border transition-all font-medium", carrierType === "paper" ? "border-black bg-black text-white dark:bg-white dark:text-black" : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800")}>
                      紙本發票
                    </button>
                  </div>
                  {carrierType === "mobile" && (
                    <input required type="text" className="w-full mt-3 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="請輸入手機條碼 (如: /AB12345)" />
                  )}
                </div>
              )}

              {/* 公司發票：輸入統編、抬頭與地址 */}
              {invoiceType === "company" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">統一編號</label>
                    <input required type="text" maxLength={8} className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="8碼數字" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">公司抬頭</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="公司名稱" />
                  </div>
                  
                  {/* 🔥 加入同收件人地址功能 */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">發票寄送地址</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isSameAsShipping}
                          onChange={(e) => setIsSameAsShipping(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black"
                        />
                        <span className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
                          同收件資訊地址
                        </span>
                      </label>
                    </div>
                    <input 
                      required={!isSameAsShipping} // 如果勾選了就不需要手動必填
                      disabled={isSameAsShipping}  // 勾選後變成灰色不可輸入
                      type="text" 
                      className={cn(
                        "w-full px-4 py-3 rounded-lg outline-none text-sm transition-all",
                        isSameAsShipping 
                          ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 cursor-not-allowed" 
                          : "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black"
                      )} 
                      placeholder={isSameAsShipping ? "將寄送至上方收件資訊地址" : "請填寫紙本發票寄送地址"} 
                    />
                  </div>
                </div>
              )}
            </section>

            {/* 5. 付款方式 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> 付款方式
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button type="button" onClick={() => setPayment("credit_card")} className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left", payment === "credit_card" ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/50" : "border-zinc-200 hover:border-zinc-300")}>
                  <CreditCard className="w-6 h-6 text-zinc-700 dark:text-zinc-300 shrink-0" />
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white">信用卡 / 金融卡</div>
                    <div className="text-xs text-zinc-500 mt-0.5">藍新金流 NewebPay</div>
                  </div>
                </button>
                <button type="button" onClick={() => setPayment("line_pay")} className={cn("flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left", payment === "line_pay" ? "border-[#06C755] bg-[#06C755]/5 dark:bg-[#06C755]/10" : "border-zinc-200 hover:border-zinc-300")}>
                  <Wallet className={cn("w-6 h-6 shrink-0", payment === "line_pay" ? "text-[#06C755]" : "text-zinc-700 dark:text-zinc-300")} />
                  <div>
                    <div className={cn("font-bold", payment === "line_pay" ? "text-[#06C755]" : "text-zinc-900 dark:text-white")}>LINE Pay</div>
                    <div className="text-xs text-zinc-500 mt-0.5">行動支付</div>
                  </div>
                </button>
              </div>

              {payment === "credit_card" && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-3">
                    <input required type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="卡號 (1234 5678 9101 1121)" />
                    <div className="grid grid-cols-2 gap-3">
                      <input required type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="到期日 (MM/YY)" />
                      <input required type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black outline-none text-sm" placeholder="安全碼 (CVC)" />
                    </div>
                  </div>
                </div>
              )}
              {payment === "line_pay" && (
                <div className="p-6 rounded-xl border border-[#06C755]/20 bg-[#06C755]/5 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-[#06C755]">點擊「確認付款」後，將會引導您至 LINE Pay 進行授權。</p>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* ================= 右欄：訂單摘要 ================= */}
        <div className="flex-1 lg:max-w-[40%] w-full">
          <div className="sticky top-24 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">訂單摘要</h2>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
              {cartData.length === 0 ? (
                <div className="text-zinc-500 text-sm py-4">您的購物車目前沒有商品。</div>
              ) : (
                cartData.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-zinc-200">
                      <Image src={item.image_url[0]} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-h-[5rem]">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-zinc-500 mt-1">${item.price}</p>
                        </div>
                        <div className="font-bold text-zinc-900 dark:text-white shrink-0">${item.price * item.stock_amount}</div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-zinc-200 rounded-lg bg-white">
                          <button type="button" onClick={() => handleMinus(item.id, item.stock_amount)} disabled={item.stock_amount <= 1} className="p-1.5 text-zinc-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-bold">{item.stock_amount}</span>
                          <button type="button" onClick={() => handlePlus(item.id, item.stock_amount)} className="p-1.5 text-zinc-500 hover:text-black transition-colors"><Plus size={14} /></button>
                        </div>
                        <button type="button" onClick={() => handleDelete(item.id, item.name)} className="text-zinc-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 border-t border-zinc-200 pt-6 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>小計</span>
                <span className="font-medium text-zinc-900">${subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>運費 ({logistics === "home" ? "宅配" : "超商"})</span>
                <span className="font-medium text-zinc-900">{shippingFee === 0 ? "免費" : `$${shippingFee}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-200 pt-4 mt-4 mb-8">
              <span className="text-lg font-bold text-zinc-900">總計</span>
              <span className="text-2xl font-bold text-black">
                <span className="text-sm text-zinc-500 font-normal mr-1">USD</span>
                ${orderTotal}
              </span>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || cartData.length === 0}
              className={cn(
                "w-full h-14 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                payment === "line_pay" 
                  ? "bg-[#06C755] hover:bg-[#05b04a] text-white shadow-[#06C755]/20" 
                  : "bg-black hover:bg-zinc-800 text-white shadow-black/10 shadow-xl"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? "處理中..." : (payment === "line_pay" ? "使用 LINE Pay 付款" : "確認付款")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
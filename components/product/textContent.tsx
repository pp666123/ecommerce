"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/app/product/[id]/page";

export default function TextContent(storeData: Product) {
  const { company, title, content, price, discount } = storeData;
  const [count, setCount] = useState(1);
  const postCartData = useCartStore((state) => state.postCartData);

  const addClickHandler = () => {
    if (count === 0) {
      // 中文錯誤提示
      return toast.error("請選擇數量！", {
        description: "您必須至少加入 1 件商品到購物車。",
      });
    }

    // 中文成功通知
    toast.success("已加入購物車", {
      description: `${count} × ${title} 已成功加入您的清單。`,
    });

    postCartData({ ...storeData, amount: count });
    // setCount(0);
  };

  return (
    <div className="flex flex-col justify-center gap-8 w-full max-w-[550px] mx-auto lg:mx-0 px-4 md:px-0 mb-16">
      {/* 2. 公司名稱與標題 */}
      <div className="flex flex-col gap-4">
        <div className="text-orange-500 font-bold uppercase tracking-widest text-sm">
          {company}
        </div>
        <h1 className="text-5xl font-bold leading-tight text-slate-900">
          {title}
        </h1>
      </div>

      {/* 3. 描述文字 */}
      <p className="text-slate-500 leading-relaxed text-base">{content}</p>

      {/* 4. 價格區域 */}
      <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-2">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">${price.toFixed(2)}</div>
          <span className="bg-orange-100 text-orange-500 font-bold px-2 py-0.5 rounded-md text-sm">
            {discount}% OFF
          </span>
        </div>
        {/* 原價 */}
        <del className="text-slate-400 font-bold ml-auto lg:ml-0">
          ${((price / discount) * 100).toFixed(2)}
        </del>
      </div>

      {/* 5. 按鈕區域 */}
      <div className="flex gap-4 mt-2">
        <div className="w-full lg:w-1/3">
          <QuantitySelector count={count} setCount={setCount} />
        </div>

        <Button
          className="flex-1 h-14 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl shadow-2xl shadow-orange-200 transition-all"
          onClick={addClickHandler}
        >
          <ShoppingCartIcon className="mr-3 h-5 w-5" />
          加入購物車
        </Button>
      </div>
    </div>
  );
}

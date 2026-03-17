"use client";
import { Stores } from "./page";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

export default function TextContent(storeData: Stores) {
  const { company, title, content, price, discount } = storeData;
  const [count, setCount] = useState(0);
  const postCartData = useCartStore((state) => state.postCartData);

  const addClickHandler = () => {
    if (count === 0) {
      // 錯誤警告
      return toast.error("Please select a quantity!", {
        description: "You must add at least 1 item to your cart.",
      });
    }

    // 成功通知
    toast.success("Added to cart", {
      description: `${count} × ${title} has been added to your list.`,
    });
    postCartData({ ...storeData, amount: count });
    setCount(0);
  };

  return (
    // 1. 手機版 px-6, 電腦版 pr-20 且不再 pr-88
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

      {/* 4. 價格區域：手機版橫向排列並置中對齊 */}
      <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-2">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">${price.toFixed(2)}</div>
          <span className="bg-orange-100 text-orange-500 font-bold px-2 py-0.5 rounded-md text-sm">
            {discount}%
          </span>
        </div>
        {/* 原價 */}
        <del className="text-slate-400 font-bold ml-auto lg:ml-0">
          ${((price / discount) * 100).toFixed(2)}
        </del>
      </div>

      {/* 5. 按鈕區域：手機版垂直堆疊，電腦版水平排列 */}
      <div className="flex gap-4 mt-2">
        <div className="w-full lg:w-1/3 ">
          <QuantitySelector count={count} setCount={setCount} />
        </div>

        <Button
          className="flex-1 h-14 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl shadow-2xl shadow-orange-200 transition-all"
          onClick={addClickHandler}
        >
          <ShoppingCartIcon className="mr-3 h-5 w-5" />
          Add to cart
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ShoppingCartIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/services/api";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";

export default function TextContent(product: Product) {
  const { company, name, description, price, discount } = product;
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false); // 新增：加入成功的暫時狀態
  const postCartData = useCartStore((state) => state.postCartData);

  // 修正後的原價計算邏輯
  const originalPrice = discount > 0 ? (price / (1 - discount / 100)).toFixed(2) : null;

  const addClickHandler = () => {
    if (count <= 0) {
      return toast.error("請選擇有效數量！", {
        description: "加入購物車的商品數量必須大於 0。",
      });
    }

    postCartData({ ...product, stock_amount: count });
    
    // 視覺反饋
    setIsAdded(true);
    toast.success("已加入購物車", {
      description: `${count} × ${name} 已放入您的購物車。`,
    });

    // 1.5 秒後將按鈕恢復原樣
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="flex flex-col justify-center gap-8 w-full max-w-[550px] mx-auto lg:mx-0 px-4 md:px-0 mb-16">
      
      {/* 品牌與標題 */}
      <div className="flex flex-col gap-4">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
          {company}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
          {name}
        </h1>
      </div>

      {/* 描述 */}
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">
        {description}
      </p>

      {/* 價格區域 */}
      <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-3">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold dark:text-white">
            ${Number(price).toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-md text-sm">
              {discount}% OFF
            </span>
          )}
        </div>
        {originalPrice && (
          <del className="text-slate-400 font-bold ml-auto lg:ml-0">
            ${originalPrice}
          </del>
        )}
      </div>

      {/* 操作區 */}
      <div className="flex gap-4 mt-2">
        <div className="w-full lg:w-1/3">
          <QuantitySelector count={count} setCount={setCount} />
        </div>

        <Button
          className={cn(
            "flex-1 h-14 font-bold rounded-xl shadow-lg transition-all",
            isAdded 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-200"
          )}
          onClick={addClickHandler}
          disabled={isAdded} // 加入後暫時禁用防止誤觸
        >
          {isAdded ? (
            <>
              <Check className="mr-3 h-5 w-5" /> 已加入
            </>
          ) : (
            <>
              <ShoppingCartIcon className="mr-3 h-5 w-5" /> 加入購物車
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
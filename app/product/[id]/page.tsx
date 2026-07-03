"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageContent from "@/components/product/imageContent";
import TextContent from "@/components/product/textContent";
// 🔥 引入你寫好的單一商品查詢 Hook (請確認路徑是否符合你的專案結構)
import { useProductById } from "@/hooks/useProducts";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. 解開網址列參數的 Promise
  const { id } = use(params);

  // 2. 透過 Hook 呼叫 API 取得商品資料
  const { data: product, isLoading, isError } = useProductById(Number(id));

  // 3. 處理載入中畫面
  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-slate-500">
        商品資料載入中...
      </div>
    );
  }

  // 4. 處理找不到商品或發生錯誤的畫面
  if (isError || !product) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <p className="mb-4 text-lg font-medium text-slate-700">找不到該商品</p>
        <Link href="/collections" className="text-orange-500 hover:underline">
          返回商品列表
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 mt-4 md:mt-8">
      {/* 麵包屑導覽 / 返回按鈕 */}
      <div className="mb-6 md:mb-10 px-4 md:px-0">
        <Link
          href="/collections"
          className="inline-flex items-center text-slate-500 hover:text-orange-500 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回精選系列
        </Link>
      </div>

      {/* 複用你原本完美的 Women 區塊排版 */}
      <div className="w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        {/* 左側：圖片輪播 (ImageContent) */}
        <div className="w-full flex-1 max-w-2xl">
          <ImageContent {...product} />
        </div>

        {/* 右側：文字與購買操作區 ProductDetailPage(TextContent) */}
        <div className="w-full flex-1 flex flex-col justify-center px-4 md:px-0 max-w-xl">
          <TextContent {...product} />
        </div>
      </div>
    </div>
  );
}

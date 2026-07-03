"use client";

import { use, useMemo } from "react";
import ProductGrid, { Title } from "@/components/product-grid";
import { useCategoryBySlug, useProducts } from "@/hooks/useProducts";

export default function CollectionsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  // 1. 在 Client Component 中，使用 React.use() 解開 params 的 Promise
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug ? resolvedParams.slug[0] : "all";

  // 2. 呼叫 Hooks 取得資料
  // 如果是 "all"，傳入空字串讓 useCategoryBySlug 不發送請求 (依賴 enabled: !!slug)
  const { data: categoryData, isLoading: isCategoryLoading } =
    useCategoryBySlug(categorySlug === "all" ? "" : categorySlug);

  // 如果是 "all"，不帶參數；如果有特定分類，帶入 { category: slug }
  const { data: products, isLoading: isProductsLoading } = useProducts(
    categorySlug === "all" ? undefined : { category: categorySlug },
  );

  // 3. 動態標題邏輯：根據 Hook 拿到的資料動態生成
  const categoryTitle: Title = useMemo(() => {
    // 如果 API 有成功抓到特定分類的資料
    if (categoryData) {
      return {
        image: categoryData.image_url || "",
        subName: categoryData.sub_name || "Collection",
        name: categoryData.name,
        text: categoryData.description || "探索本季為您精心挑選的潮流單品。",
      };
    }

    // 預設 Fallback (對應 "all" 或是 API 找不到資料的情況)
    return {
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=2070",
      subName: "Curated For You",
      name: "精選系列",
      text: "探索本季為您精心挑選的潮流單品。",
    };
  }, [categoryData]);

  // 4. 處理載入中的畫面 (可依照你的 UI 換成專屬的骨架屏 Skeleton)
  if (isProductsLoading || isCategoryLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-slate-500">
        資料載入中...
      </div>
    );
  }

  // 5. 將資料傳入你的 Grid 元件
  return <ProductGrid products={products || []} title={categoryTitle} />;
}

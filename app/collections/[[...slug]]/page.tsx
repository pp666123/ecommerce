// 移除 "use client" 與不需要的 React Hooks
import ProductGrid, { Title } from "@/components/collections/product-grid";
// 假設你有可以直接在 Server 呼叫的 API function，而不是 Hooks
import { categoryApi, productApi } from "@/services/api";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug ? resolvedParams.slug[0] : "all";

  // 1. 直接呼叫 API 函式 (不需要 Hook，也不需要處理 isLoading)
  // 使用 Promise.all 平行獲取資料以加快速度
  const [categoryData, products] = await Promise.all([
    categorySlug === "all" ? null : categoryApi.getBySlug(categorySlug),
    productApi.getAll(
      categorySlug === "all" ? undefined : { category: categorySlug },
    ),
  ]);

  // 2. 直接計算 title 資料 (移除 useMemo，直接定義變數即可)
  const categoryTitle: Title = categoryData
    ? {
        image: categoryData.image_url || "",
        subName: categoryData.sub_name || "Collection",
        name: categoryData.name,
        text: categoryData.description || "探索本季為您精心挑選的潮流單品。",
      }
    : {
        image:
          "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=2070",
        subName: "Curated For You",
        name: "精選系列",
        text: "探索本季為您精心挑選的潮流單品。",
      };

  // 3. 直接回傳元件
  // Server Component 不會有 "載入中" 的狀態，Next.js 會直接呈現最後結果
  return <ProductGrid products={products || []} title={categoryTitle} />;
}

import ProductGrid, { Title } from "@/components/product-grid";
import { getProductsByCategory, allProducts } from "@/lib/products";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  // 取得第一個參數作為分類
  const category = slug ? slug[0] : "all";

  // 取得商品數據
  const products =
    category === "all" ? allProducts : getProductsByCategory(category);

  // 動態標題邏輯
  const getCategoryTitle = (): Title => {
    switch (category) {
      case "men":
        return {
          image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=2070",
          subName: "Men's Collection",
          name: "男款精選",
          text: "探索本季為您精心挑選的潮流單品。",
        };
      case "women":
        return {
          image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070",
          subName: "Women's Collection",
          name: "女款精選",
          text: "展現屬於您的獨特街頭美學。",
        };
      case "kids":
        return {
          image: "https://images.unsplash.com/photo-1503919545889-aeff636e1027?auto=format&fit=crop&q=80&w=2070",
          subName: "Kids Collection",
          name: "童裝系列",
          text: "讓小小探索者擁有最舒適的潮流裝備。",
        };
      case "accessories":
        return {
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2070",
          subName: "Accessories",
          name: "風格配件",
          text: "細節決定質感，點綴您的每日穿搭。",
        };
      default:
        return {
          image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=2070",
          subName: "Curated For You",
          name: "精選系列",
          text: "探索本季為您精心挑選的潮流單品。",
        };
    }
  };

  return <ProductGrid products={products} title={getCategoryTitle()} />;
}
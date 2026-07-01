import { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageContent from "@/components/product/imageContent";
import TextContent from "@/components/product/textContent";

export type Product = {
  id: string;
  images: (StaticImageData | string)[];
  thumbnail: (StaticImageData | string)[];
  company: string;
  title: string;
  content: string;
  price: number;
  discount: number;
  amount: number;
};

const getProductData = (id: string): Product => {
  return {
    id: id,
    company: "URBAN EXPLORER",
    title: "橘流 城市機能跑鞋",
    content:
      "專為城市探索打造的機能跑鞋。採用透氣抗撕裂網布，搭配獨家高回彈橘色氣墊中底。無論是日常通勤還是街頭穿搭，都能展現極致的潮流態度與絕對的舒適感。",
    price: 185,
    discount: 15, // 假設這雙鞋目前有 15% 折扣
    amount: 0,
    // 提供 4 張不同的 Unsplash 圖片，讓左側 ImageContent 有輪播圖可以切換
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    ],
    thumbnail: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
    ],
  };
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 取得網址列的 id (例如 101)
  const { id } = await params;
  const productData = getProductData(id);

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
          <ImageContent {...productData} />
        </div>

        {/* 右側：文字與購買操作區 (TextContent) */}
        <div className="w-full flex-1 flex flex-col justify-center px-4 md:px-0 max-w-xl">
          <TextContent {...productData} />
        </div>
      </div>
    </div>
  );
}

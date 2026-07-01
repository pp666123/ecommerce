import { StaticImageData } from "next/image";

import product1Img from "@/assets/store/image-product-1.jpg";
import product2Img from "@/assets/store/image-product-2.jpg";
import product3Img from "@/assets/store/image-product-3.jpg";
import product4Img from "@/assets/store/image-product-4.jpg";

import product1tImg from "@/assets/store/image-product-1-thumbnail.jpg";
import product2tImg from "@/assets/store/image-product-2-thumbnail.jpg";
import product3tImg from "@/assets/store/image-product-3-thumbnail.jpg";
import product4tImg from "@/assets/store/image-product-4-thumbnail.jpg";
import ImageContent from "@/components/product/imageContent";
import TextContent from "@/components/product/textContent";

// 1. 將型別名稱正名為 Product (因為這是商品資料，不是商店)
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

// 2. 將變數名稱改為 productData
const productData: Product = {
  id: "gyjhkljkl123",
  images: [product1Img, product2Img, product3Img, product4Img],
  thumbnail: [product1tImg, product2tImg, product3tImg, product4tImg],
  company: "潮流鞋履公司",
  title: "秋季限量版運動鞋",
  content: `這款低筒運動鞋是你日常休閒穿搭的絕佳選擇。採用耐用的橡膠外底設計，能有效適應各種天氣狀況。`,
  price: 125,
  discount: 50,
  amount: 0,
};

export default function Women() {
  return (
    // 3. 改用 md:flex-row 並加入 gap，確保文字和圖片不會黏在一起
    <div className="w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-8">
      {/* 左側：圖片輪播 (限制最大寬度避免過度放大) */}
      <div className="w-full flex-1 max-w-2xl">
        <ImageContent {...productData} />
      </div>

      {/* 右側：文字與購買操作區 */}
      <div className="w-full flex-1 flex flex-col justify-center px-4 md:px-0 max-w-xl">
        <TextContent {...productData} />
      </div>
    </div>
  );
}

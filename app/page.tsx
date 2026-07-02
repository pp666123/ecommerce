import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
import { Product } from "./product/[id]/page";


export default function Home() {
  const categories = [
    {
      name: "女裝",
      slug: "women",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "男裝",
      slug: "men",
      image:
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "童裝",
      slug: "kids",
      image:
        "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "配件",
      slug: "accessories",
      image:
        "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const newArrivals = [
    {
      id: 1,
      name: "經典紅黑休閒鞋",
      category: "男款鞋",
      price: "125.00",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      name: "極簡白運動鞋",
      category: "男款鞋",
      price: "140.00",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      name: "復古街頭滑板鞋",
      category: "女款鞋",
      price: "95.00",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      name: "機能訓練慢跑鞋",
      category: "男款鞋",
      price: "160.00",
      image:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800",
    },
  ];

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

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 space-y-20 md:space-y-32 mt-6 md:mt-12 text-slate-900 dark:text-white">
      {/* 1. Hero Section (主視覺橫幅) */}
      <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] bg-slate-900 rounded-[2rem] overflow-hidden flex items-center justify-center sm:justify-start px-8 sm:px-16 lg:px-24 shadow-2xl shadow-slate-200 dark:shadow-none">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2071"
          alt="秋季時尚主視覺"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-6 text-center sm:text-left text-white">
          <div className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2">
            New Arrival
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            2026 <br className="hidden sm:block" /> 秋季全新系列
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            探索最新時尚潮流。專為舒適而生，為品味而打造。
          </p>
          {/* 套用特色的橘色按鈕與陰影 */}
          <Button
            className="h-14 px-8 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl shadow-xl shadow-orange-500/30 transition-all text-lg mt-4"
            asChild
          >
            <Link href="/collections">
              立即選購 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 2. Categories (快速分類區塊) */}
      <section className="space-y-8 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">精選分類</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              // Hover 時邊框亮起特色橘色
              className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:ring-4 hover:ring-orange-500 ring-offset-2 dark:ring-offset-slate-950"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors z-10" />
              <span className="text-xl md:text-3xl font-bold text-white z-20 tracking-wider drop-shadow-md">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Product (你的主打商品區塊) */}
      <section className="px-4 md:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-8 md:mb-12 text-center md:text-left">
          本月主打
        </h2>
        <div className="w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          {/* 左側：圖片輪播 (限制最大寬度避免過度放大) */}
          <div className="w-full flex-1 max-w-2xl">
            <ImageContent {...productData} />
          </div>

          {/* 右側：文字與購買操作區 */}
          <div className="w-full flex-1 flex flex-col justify-center px-4 md:px-0 max-w-xl">
            <TextContent {...productData} />
          </div>
        </div>
      </section>

      {/* 4. New Arrivals (最新商品網格) */}
      <section className="space-y-8 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">新品上市</h2>
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-bold"
            asChild
          >
            <Link href="/collections">查看全部</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group block space-y-4" // 將 group block 移到這裡，確保整塊點擊有效
            >
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative shadow-sm transition-all group-hover:shadow-xl group-hover:shadow-orange-500/10">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold leading-none text-lg group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500">{item.category}</p>
                <p className="font-bold text-xl text-orange-500 pt-1">
                  ${item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

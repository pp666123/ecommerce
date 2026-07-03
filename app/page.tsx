import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImageContent from "@/components/product/imageContent";
import TextContent from "@/components/product/textContent";

// 🔥 直接引入 API 函式，移除所有 hooks
import { productApi, categoryApi } from "@/services/api";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. 同時並行獲取所有首頁需要的資料
  const [categories, featured, arrivals] = await Promise.all([
    categoryApi.getAll(),
    productApi.getAll({ featured: true, limit: 1 }), // 假設 API 支援這些參數
    productApi.getAll({ limit: 4 }), // 新品列表
  ]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 space-y-20 md:space-y-32 mt-6 md:mt-12 text-slate-900 dark:text-white">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] bg-slate-900 rounded-[2rem] overflow-hidden flex items-center justify-center sm:justify-start px-8 sm:px-16 lg:px-24 shadow-2xl">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2071"
          alt="秋季時尚主視覺"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        <div className="relative z-10 max-w-xl space-y-6 text-center sm:text-left text-white">
          <div className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2">New Arrival</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">2026 <br /> 秋季全新系列</h1>
          <Button className="h-14 px-8 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl shadow-xl shadow-orange-500/30 transition-all text-lg mt-4" asChild>
            <Link href="/collections">立即選購 <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* 2. Categories */}
      <section className="space-y-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold tracking-tight">精選分類</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories?.map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image src={category.image_url || PLACEHOLDER_IMAGE} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors z-10" />
              <span className="text-xl md:text-3xl font-bold text-white z-20 drop-shadow-md">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Product */}
      {featured?.[0] && (
        <section className="px-4 md:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center md:text-left">本月主打</h2>
          <div className="w-full flex flex-col md:flex-row items-center gap-12">
            <div className="w-full flex-1 max-w-2xl"><ImageContent {...featured[0]} /></div>
            <div className="w-full flex-1 max-w-xl"><TextContent {...featured[0]} /></div>
          </div>
        </section>
      )}

      {/* 4. New Arrivals */}
      <section className="space-y-8 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">新品上市</h2>
          <Button variant="ghost" className="text-orange-500 hover:text-orange-600 font-bold" asChild><Link href="/collections">查看全部</Link></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {arrivals?.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`} className="group block space-y-4">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
                <Image src={item.image_url?.[0] || PLACEHOLDER_IMAGE} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.category}</p>
                <p className="font-bold text-xl text-orange-500">${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
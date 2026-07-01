import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter, ShoppingCartIcon } from "lucide-react";

export type ProductItem = {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
};

export type Title = {
  image: string;
  subName: string;
  name: string;
  text: string;
};



interface ProductGridProps {
  title: Title;
  products: ProductItem[];
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-0 lg:px-4 xl:px-16 pb-24 text-slate-900 dark:text-white mt-6 md:mt-12">
            {/* 1. 頁面標題區塊 (輕量版 Banner，讓視線聚焦於下方商品) */}
      <section className="relative w-full py-10 md:py-14 bg-slate-900 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200 dark:shadow-none mb-8 px-4">
        {/* 背景圖片 (保留質感) */}
        <Image
          src={title.image}
          alt="精選系列主視覺"
          fill
          className="object-cover opacity-50 mix-blend-luminosity"
          priority
        />

        {/* 暗色遮罩與橘色光暈疊加 */}
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/40 via-transparent to-transparent" />

        <div className="relative z-10 space-y-2 md:space-y-3">
          <div className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-sm drop-shadow-md">
            {title.subName}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            {title.name}
          </h1>
          <p className="text-slate-200 max-w-xl mx-auto text-sm md:text-base drop-shadow-md hidden sm:block">
            {title.text}
          </p>
        </div>
      </section>

      {/* 2. 工具列 (Toolbar: 篩選與排序) */}
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 px-2 md:px-4">
        <div className="text-slate-500 font-medium">
          顯示
          <span className="text-slate-900 dark:text-white font-bold">
            {products.length}
          </span>
          項商品
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {/* 橘色主題的篩選按鈕 */}
          <Button
            variant="outline"
            className="w-full sm:w-auto font-bold border-slate-200 hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" /> 篩選條件
          </Button>
          <select className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer">
            <option>最新上架</option>
            <option>價格：由低至高</option>
            <option>價格：由高至低</option>
          </select>
        </div>
      </section>


 {/* 3. 精選商品網格 (Product Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-2 md:px-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col space-y-4"
          >
            {/* 圖片容器 */}
            <Link
              href={`/product/${product.id}`}
              className="block relative aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all group-hover:shadow-xl group-hover:shadow-orange-500/20 group-hover:ring-4 group-hover:ring-orange-500 ring-offset-2 dark:ring-offset-slate-950"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* 新品標籤 */}
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-orange-100 text-orange-500 font-bold px-3 py-1 rounded-full text-xs tracking-wider shadow-sm">
                  NEW
                </div>
              )}

              {/* 懸浮購物車按鈕 */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 px-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-500/40">
                  <ShoppingCartIcon className="mr-2 h-4 w-4" /> 快速加入
                </Button>
              </div>
            </Link>

            {/* 商品資訊 */}
            <div className="space-y-1.5 px-1">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold leading-tight text-lg text-slate-900 dark:text-white line-clamp-1">
                  <Link
                    href={`/product/${product.id}`}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>
                {/* 橘色價格 */}
                <p className="font-bold text-xl text-orange-500 shrink-0">
                  ${product.price}
                </p>
              </div>
              <p className="text-sm text-slate-500">{product.category}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

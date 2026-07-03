"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/services/api";

export default function ImageContent(product: Product) {
  const { image_url, thumbnail_url } = product;
  const [select, setSelect] = useState(0);

  return (
    <>
      {/* 電腦版 */}
      <div className="flex flex-col items-center w-full max-w-[550px] mx-auto px-4 md:px-0 max-md:hidden">
        {/* 主圖容器 */}
        <div className="w-full relative aspect-square rounded-2xl overflow-hidden group border border-zinc-100 dark:border-zinc-800">
          <Image
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            src={image_url[select]}
            alt={`商品主圖 - ${product.name}`}
            fill
            priority // 主圖優先載入
            sizes="(max-width: 768px) 100vw, 550px"
          />
        </div>

        {/* 縮圖列 */}
        <div className="w-full flex justify-between gap-4 py-8">
          {thumbnail_url.map((item, index) => {
            const isSelected = select === index;
            return (
              <button
                key={index}
                type="button"
                className={cn(
                  "relative aspect-square w-[22%] cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-2",
                  isSelected ? "border-orange-500 shadow-md" : "border-transparent hover:opacity-70",
                )}
                onClick={() => setSelect(index)}
              >
                <Image
                  className="object-cover"
                  fill
                  src={item}
                  alt={`商品縮圖 ${index + 1}`}
                  sizes="(max-width: 768px) 20vw, 120px"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-white transition-opacity duration-300",
                    isSelected ? "opacity-0" : "opacity-0 hover:opacity-20",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 手機版 Carousel */}
      <div className="md:hidden pb-12 w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {image_url.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full">
                  <Image
                    className="object-cover rounded-xl"
                    src={image}
                    alt={`商品手機版圖片 ${index + 1}`}
                    fill
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* 加入箭頭樣式與防止箭頭與圖片過近 */}
          <div className="absolute inset-y-0 flex items-center justify-between w-full pointer-events-none px-2">
            <CarouselPrevious className="pointer-events-auto hover:text-orange-500 hover:border-orange-500" />
            <CarouselNext className="pointer-events-auto hover:text-orange-500 hover:border-orange-500" />
          </div>
        </Carousel>
      </div>
    </>
  );
}
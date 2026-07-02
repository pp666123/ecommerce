"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Product } from "@/app/product/[id]/page";

// 改為接收 Product 型別
export default function ImageContent({ images, thumbnail }: Product) {
  const [select, setSelect] = useState(0);

  return (
    <>
      {/* 電腦版 */}
      <div className="flex flex-col items-center w-full max-w-[550px] mx-auto px-4 md:px-0 max-md:hidden">
        {/* 主圖容器 */}
        <div className="w-full relative aspect-square">
          <Image
            className="rounded-2xl object-cover"
            src={images[select]}
            alt="主商品圖片"
            fill
            priority
          />
        </div>

        {/* 縮圖列 */}
        <div className="w-full flex justify-between gap-4 py-8">
          {thumbnail.map((item, index) => {
            const isSelected = select === index;
            return (
              <div
                key={index}
                className={cn(
                  "relative aspect-square w-[22%] cursor-pointer rounded-lg overflow-hidden transition-all duration-300",
                  // 核心：若被選中，則顯示橘色邊框，若未選中，則給予輕微透明度
                  isSelected ? "ring-2 ring-orange-500" : "hover:opacity-70"
                )}
                onClick={() => setSelect(index)}
              >
                <Image
                  className="object-cover"
                  fill
                  src={item}
                  alt={`縮圖 ${index + 1}`}
                />
                {/* 橘色覆蓋層 (選中時出現) */}
                <div
                  className={cn(
                    "absolute inset-0 bg-white transition-opacity duration-300",
                    isSelected ? "opacity-50" : "opacity-0 hover:opacity-30"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 手機版 (加上橘色箭頭風格) */}
      <div className="md:hidden pb-12 md:p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full">
                  <Image
                    className="object-cover rounded-xl"
                    src={image}
                    alt="商品圖片"
                    fill
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* 橘色箭頭樣式 (需確保你的 Carousel 組件支援 className 自訂) */}
          <CarouselPrevious className="left-4 hover:text-orange-500" />
          <CarouselNext className="right-4 hover:text-orange-500" />
        </Carousel>
      </div>
    </>
  );
}
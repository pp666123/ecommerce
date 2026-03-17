"use client";
import Image from "next/image";
import { Stores } from "./page";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

export default function ImageContent({ images, thumbnail }: Stores) {
  const [select, setSelect] = useState(0);

  return (
    <>
      {/* 電腦版 */}
      <div className="flex flex-col items-center w-full max-w-[550px] mx-auto px-4 md:px-0 max-md:hidden">
        {/* 2. 主圖容器：確保圖片在所有螢幕下都能自適應 */}
        <div className="w-full">
          <Image
            className="w-full h-auto rounded-xl object-cover"
            src={images[select]}
            alt="Main product image"
            priority
          />
        </div>

        <div className="w-full flex justify-between gap-4 py-8">
          {thumbnail.map((item, index) => (
            <div
              key={index}
              className="relative aspect-square w-[22%] cursor-pointer group"
              onClick={() => setSelect(index)}
            >
              <Image
                className="rounded-lg object-cover hover:opacity-50 transition-opacity"
                fill // 使用 Next.js fill 屬性配合父層 relative 更好控制 RWD
                src={item}
                alt={`Thumbnail ${index + 1}`}
              />
              {/* 遮罩層 + 橘色邊框 */}
              <div
                className={cn(
                  // 基礎定位：填滿父層
                  "absolute inset-0 rounded-lg",

                  // 1. 橘色邊框 (你原本的邏輯)
                  "border-2 border-transparent group-hover:border-orange-500",

                  // 2. 白色遮罩 (使用 ::after)
                  "after:content-[''] after:absolute after:inset-0 after:bg-white",

                  // 3. 遮罩動畫 (預設透明，hover 時變為半透明)
                  "after:opacity-0 group-hover:after:opacity-50",

                  // 4. 動畫過渡效果
                  "transition-all duration-300 after:transition-opacity after:duration-300",
                )}
              />
            </div>
          ))}
        </div>
      </div>
      {/* 手機板 */}
      <div className="md:hidden pb-12 md:p-0">
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  className="w-full h-auto rounded-xl object-cover"
                  src={image}
                  alt="product image"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}

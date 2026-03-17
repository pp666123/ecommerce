"use client";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/useCartStore";

export default function CartCom() {
  const cartData = useCartStore((state) => state.cartData);
  const delCartData = useCartStore((state) => state.delCartData);

  const cartIsnull = cartData.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer h-12" variant="ghost">
          <ShoppingCartIcon className="size-[25px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] md:w-80"
        collisionPadding={16}
      >
        <div>
          <div className="text-lg p-4">Cart</div>
          <hr />
          <div className="flex min-h-40 p-4">
            {cartIsnull ? (
              <div className="w-full flex justify-center items-center">
                Your cart is empty.
              </div>
            ) : (
              <>
                {cartData.map((data) => {
                  const { title, images, price, amount, id } = data;
                  const totle = price * amount;
                  return (
                    <div className="w-full flex flex-col gap-4" key={id}>
                      <div className="w-full flex justify-between items-center">
                        <div className="flex gap-2">
                          {/* 商品圖片 */}
                          <Image
                            className="rounded-sm"
                            height={50}
                            width={50}
                            src={images[0]}
                            alt={"Store image"}
                          />
                          {/* 文字欄位 */}
                          <div className="flex flex-col flex-2">
                            <div className="text-slate-400">{title}</div>
                            <div className="text-slate-400">
                              {`$${price} x ${amount}`}{" "}
                              <strong className="text-black">${totle}</strong>
                            </div>
                          </div>
                        </div>
                        {/* 刪除按鈕 */}
                        <Trash2Icon
                          className="cursor-pointer text-slate-400"
                          onClick={() => delCartData(id)}
                        />
                      </div>
                      {/* 送出按鈕 */}
                      <Button className="w-full text-lg p-6">Checkout</Button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

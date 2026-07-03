"use client";
import { useState } from "react"; // 1. 補上 useState 引入
import Image from "next/image";
import { Trash2Icon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import Link from "next/link";

export default function CartCom() {
  // 2. 建立控制選單開關的狀態
  const [isOpen, setIsOpen] = useState(false);

  const cartData = useCartStore((state) => state.cartData);
  const delCartData = useCartStore((state) => state.delCartData);

  const cartIsnull = cartData.length === 0;

  const cartTotal = cartData.reduce(
    (total, item) => total + item.price * item.stock_amount,
    0,
  );

  const deleteClickHandler = (id: number, title: string) => {
    toast.success("已移除商品", {
      description: `${title} 已從購物車中移除。`,
    });
    delCartData(id);
  };

  return (
    // 3. 綁定 open 與 onOpenChange 來手動控制選單
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="cursor-pointer h-12 w-12 relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          variant="ghost"
          size="icon"
        >
          <ShoppingCartIcon className="size-[25px] text-zinc-800 dark:text-zinc-200" />

          {!cartIsnull && (
            <span className="absolute top-1 right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black dark:bg-white text-[10px] font-bold text-white dark:text-black border-2 border-white dark:border-zinc-950 shadow-sm">
              {cartData.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] md:w-80 p-0 rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950"
        collisionPadding={16}
      >
        <div className="flex flex-col">
          <div className="text-lg font-bold p-4 border-b border-zinc-100 dark:border-zinc-800/50 text-zinc-900 dark:text-zinc-100">
            購物車
          </div>

          <div className="flex flex-col p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {cartIsnull ? (
              <div className="w-full flex flex-col justify-center items-center py-10 text-zinc-400 dark:text-zinc-600">
                <ShoppingCartIcon className="size-12 mb-3 opacity-20" />
                <p className="font-medium text-sm">您的購物車是空的</p>
              </div>
            ) : (
              <div className="space-y-5">
                {cartData.map((data) => {
                  const { name, image_url, price, stock_amount, id } = data;
                  const total = price * stock_amount;
                  return (
                    <div
                      className="w-full flex justify-between items-center gap-3 group"
                      key={id}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                          <Image
                            className="object-cover"
                            fill
                            src={image_url[0]}
                            alt={name}
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="text-zinc-900 dark:text-zinc-100 font-bold text-sm line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">
                            {name}
                          </div>
                          <div className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5 flex items-center gap-1">
                            <span>{`$${price} x ${stock_amount}`}</span>
                            <strong className="text-black dark:text-white text-base ml-auto">
                              ${total}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteClickHandler(id, name)}
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0 h-8 w-8 rounded-full transition-all"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {!cartIsnull && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto bg-zinc-50/50 dark:bg-zinc-900/20">
              {/* 4. 在 Link 加上 onClick 事件來關閉選單 */}
              <Link
                href="/checkout"
                className="block w-full"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full text-base font-bold h-12 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-lg shadow-black/10 transition-all">
                  前往結帳 (${cartTotal})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

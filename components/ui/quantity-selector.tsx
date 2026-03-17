import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react"; // shadcn 預設使用的圖標庫

export type QuantitySelectorType = {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
};

export function QuantitySelector({ count, setCount }: QuantitySelectorType) {
  return (
    <div className="flex items-center justify-between bg-slate-100 rounded-lg w-full md:w-40 h-14">
      {/* 減少按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-transparent text-orange-500 hover:opacity-60 transition-opacity p-4"
        onClick={() => setCount(Math.max(0, count - 1))}
      >
        <Minus className="h-4 w-4 stroke-[4px]" />
      </Button>

      {/* 數量顯示 */}
      <span className="font-bold text-black w-8 text-center">{count}</span>

      {/* 增加按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-transparent text-orange-500 hover:opacity-60 transition-opacity p-4"
        onClick={() => setCount(count + 1)}
      >
        <Plus className="h-4 w-4 stroke-[4px]" />
      </Button>
    </div>
  );
}

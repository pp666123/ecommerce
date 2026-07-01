import { MenuIcon, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavigationCom from "./navigation";

export default function SheetCom() {
  return (
    <div className="flex items-center gap-6 md:hidden">
      <Sheet>
        {/* 1. 移除 asChild，直接將原本 Button 的樣式寫在 SheetTrigger 上 */}
        <SheetTrigger className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
          <MenuIcon className="size-[25px]" />
        </SheetTrigger>
        
        <SheetContent showCloseButton={false} side="left" className="w-[80vw] sm:w-[350px]">
          <SheetHeader className="text-left">
            <SheetClose className="w-fit mb-8 focus:outline-none">
              <X className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Close</span>
            </SheetClose>
            
            <div className="flex flex-col items-start gap-6 text-xl mt-4 w-full">
              {/* 2. 移除 asChild，直接將排版用的 className 寫在 SheetClose 上 */}
              <SheetClose className="flex flex-col items-start gap-6 w-full text-left focus:outline-none">
                <NavigationCom />
              </SheetClose>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
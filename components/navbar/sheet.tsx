import { MenuIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="flex items-center gap-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost">
                <MenuIcon className="size-[25px]" />
              </Button>
            }
          />
          <SheetContent showCloseButton={false} side="left">
            <SheetHeader>
              <SheetClose className="w-fit mb-10">
                <X className="h-6 w-6 text-slate-500" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <SheetClose className="flex flex-col items-start gap-4 text-xl">
                <NavigationCom />
              </SheetClose>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

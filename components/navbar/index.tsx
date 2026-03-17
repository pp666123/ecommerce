import Logo from "@/components/navbar/logo";
import AvatarCom from "./avatar";
import SheetCom from "./sheet";
import Link from "next/link";
import CartCom from "./cart";
import NavigationCom from "./navigation";

const Navbar = () => {
  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="mx-auto flex items-center justify-between gap-8 py-7 px-4 lg:px-12 xl:px-24">
        <div className="flex justify-between w-full px-0 sm:px-8">
          <div className="w-full flex justify-start">
            <div className="text-muted-foreground flex flex-1 items-center font-medium justify-between gap-4">
              {/* navbar項目 */}
              <div className="flex items-center gap-4">
                {/* 左側清單 */}
                <SheetCom />
                {/* logo */}
                <Link href="/">
                  <Logo className="text-foreground gap-3" />
                </Link>
              </div>
              {/* navigation */}
              <div className="w-full flex gap-8 lg:gap-18 max-md:hidden">
                <NavigationCom />
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center gap-2">
            <CartCom />
            <AvatarCom />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

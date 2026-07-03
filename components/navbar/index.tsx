import Logo from "@/components/navbar/logo";
import AvatarCom from "./avatar";
import Sheet from "./sheet";
import Link from "next/link";
import Cart from "./cart";
import NavigationComponent from "./navigation";

const Navbar = () => {
  return (
    // 新增毛玻璃效果 (backdrop-blur-md) 與底部邊框 (border-b)
    <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* 高度微調為 py-4，讓導覽列更俐落 */}
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-8 py-4 px-4 md:px-0 lg:px-4 xl:px-16">
        {/* 以下完全保留你的排版與結構 */}
        <div className="flex justify-between w-full px-0 sm:px-8">
          {/* <div className="w-full flex justify-start"> */}
          <div className="text-zinc-500 dark:text-zinc-400 flex flex-1 items-center font-medium justify-between gap-4">
            {/* navbar項目 */}
            <div className="flex items-center gap-4">
              {/* 左側清單 */}
              <Sheet />
              {/* logo */}
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <Logo className="text-zinc-900 dark:text-white gap-3" />
              </Link>
            </div>

            {/* navigation */}
            <div className="w-full flex gap-8 lg:gap-18 max-md:hidden justify-center">
              <NavigationComponent />
            </div>
          </div>
          {/* </div> */}

          <div className="flex justify-around items-center gap-2">
            <Cart />
            <AvatarCom />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

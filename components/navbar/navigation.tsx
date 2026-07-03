import Link from "next/link";

type NavigationData = {
  title: string;
  href: string;
}[];

export default function NavigationCom() {
  const navigationData: NavigationData = [
    { title: "精選系列", href: "/collections" },
    { title: "男裝", href: "/collections/men" },
    { title: "女裝", href: "/collections/women" },
    { title: "童裝", href: "/collections/kids" },
    { title: "配件", href: "/collections/accessories" },
    { title: "關於我們", href: "/about" },
    { title: "聯絡我們", href: "/contact" },
  ];

  return (
    <>
      {navigationData.map((data, index) => (
        <Link
          href={data.href}
          key={index}
          className="
            text-muted-foreground hover:text-foreground font-medium transition-all
            /* 👇 核心優化：手機版設定為區塊、全寬、增加上下 padding 擴大點擊範圍 */
            block w-full py-4 px-2
            /* 👇 視覺回饋 (選用)：手機版點擊或 hover 時給個淡淡的背景色，讓使用者知道整行都是按鈕 */
            hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg
            /* 👇 桌機版還原：如果桌機版是橫排，用 md: 把它變回原本的樣子 */
            md:inline-block md:w-auto md:p-0 md:hover:bg-transparent md:rounded-none
          "
        >
          {data.title}
        </Link>
      ))}
    </>
  );
}

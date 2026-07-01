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
          // 加入過渡動畫與適應深色模式的顏色
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          {data.title}
        </Link>
      ))}
    </>
  );
}

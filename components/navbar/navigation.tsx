import Link from "next/link";
type NavigationData = {
  title: string;
  href: string;
}[];

export default function NavigationCom() {
  const navigationData: NavigationData = [
    {
      title: "Collections",
      href: "/",
    },
    {
      title: "Men",
      href: "women",
    },
    {
      title: "Women",
      href: "women",
    },
    {
      title: "About",
      href: "women",
    },
    {
      title: "Contact",
      href: "women",
    },
  ];
  return (
    <>
      {navigationData.map((data, index) => (
        <Link href={data.href} key={index} className="hover:text-primary">
          {data.title}
        </Link>
      ))}
    </>
  );
}

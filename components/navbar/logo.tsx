import LogoImg from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo = ({ className, width = 150, height = 40 }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2.5 pb-1", className)}>
      <Image
        src={LogoImg}
        alt="Urban Explorer Logo"
        width={width}
        height={height}
        priority // 🔥 對於 Logo，建議加上 priority 以優化 LCP
        className="w-full h-full object-contain" // 確保維持 SVG 比例
      />
    </div>
  );
};

export default Logo;

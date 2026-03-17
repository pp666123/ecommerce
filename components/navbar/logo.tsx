import LogoImg from "@/assets/logo.svg";

// Util Imports
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-[150px] flex items-center gap-2.5 pb-1", className)}>
      <Image src={LogoImg} alt={"Logo"}></Image>
    </div>
  );
};

export default Logo;

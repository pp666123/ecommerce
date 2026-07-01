"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Package, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import avatarImg from "@/assets/image-avatar.png";

export default function AvatarCom() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // 模擬登入狀態 (未來這裡可替換為 Zustand 或 NextAuth 的狀態)
  // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoggedIn = false; // 你可以改成 true 來看看已登入的頭像狀態

  const handleLogout = () => {
    setIsOpen(false);
    toast.success("已成功登出", { description: "期待您再次光臨。" });
    // 執行登出邏輯...
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger className="outline-none">
        {/* 觸發器：已登入顯示頭像，未登入顯示預設 User Icon */}
        <Avatar className="h-10 w-10 border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer mx-2">
          {isLoggedIn ? (
            <AvatarImage src={avatarImg.src} alt="會員頭像" className="object-cover" />
          ) : (
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <User size={20} />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-950 p-2 mt-2"
        collisionPadding={16}
      >
        {isLoggedIn ? (
          // ================= 已登入狀態選單 =================
          <>
            <div className="px-2 py-3 flex flex-col">
              <span className="font-bold text-sm text-zinc-900 dark:text-white">Qiaolin</span>
              <span className="text-xs text-zinc-500">hello@example.com</span>
            </div>
            
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900 transition-colors"
              onClick={() => handleNavigation("/orders")}
            >
              <Package className="mr-3 h-4 w-4" /> 
              <span className="font-medium">我的訂單</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900 transition-colors"
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="mr-3 h-4 w-4" /> 
              <span className="font-medium">帳號設定</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" /> 
              <span className="font-bold">登出</span>
            </DropdownMenuItem>
          </>
        ) : (
          // ================= 未登入狀態選單 =================
          <>
            <div className="px-2 py-3 mb-1">
              <span className="font-bold text-sm text-zinc-900 dark:text-white">歡迎光臨</span>
              <p className="text-xs text-zinc-500 mt-1">登入以享受專屬會員服務</p>
            </div>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900 transition-colors"
              onClick={() => handleNavigation("/login")}
            >
              <LogIn className="mr-3 h-4 w-4" /> 
              <span className="font-bold">會員登入</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-xl py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900 transition-colors"
              onClick={() => handleNavigation("/register")}
            >
              <UserPlus className="mr-3 h-4 w-4" /> 
              <span className="font-medium">立即註冊</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
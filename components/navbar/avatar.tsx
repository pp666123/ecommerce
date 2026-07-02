"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Package, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import avatarImg from "@/assets/image-avatar.png";
import { authApi, UserProfile } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function AvatarCom() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { user, setUser, checkAuth } = useAuthStore();
  const isLoggedIn = !!user;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 真實登出邏輯
  const handleLogout = async () => {
    try {
      await authApi.logout(); // 呼叫 API 清除 HttpOnly Cookie
      setUser(null); // 清除前端狀態
      setIsOpen(false);
      toast.success("已成功登出", { description: "期待您再次光臨。" });

      router.push("/login");
      router.refresh(); // 強制刷新畫面，確保所有 Server Component 更新狀態
    } catch (error) {
      toast.error("登出失敗，請稍後再試");
    }
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="cursor-pointer h-12 w-12 relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          variant="ghost"
          size="icon"
        >
          <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700 transition-all">
            {/* 1. 永遠存在，但 src 條件給予 */}
            <AvatarImage
              src={isLoggedIn ? avatarImg.src : undefined}
              alt="會員頭像"
              className="object-cover"
            />
            {/* 2. 永遠存在，當上方 src 為 undefined 時，會自動顯示這個 Fallback */}
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <User size={18} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-0 rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950"
        collisionPadding={16}
      >
        <div className="flex flex-col">
          {isLoggedIn ? (
            // ================= 已登入狀態選單 =================
            <>
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
                {/* 🔥 動態顯示真實名稱與信箱 */}
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  {user.username}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {user.email}
                </span>
              </div>

              <div className="p-2 space-y-1">
                {/* <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:bg-zinc-100 dark:focus:bg-zinc-800/50 transition-colors flex items-center"
                  onClick={() => handleNavigation("/orders")}
                >
                  <Package className="mr-3 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    我的訂單
                  </span>
                </DropdownMenuItem> */}

                {/* <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:bg-zinc-100 dark:focus:bg-zinc-800/50 transition-colors flex items-center"
                  onClick={() => handleNavigation("/settings")}
                >
                  <Settings className="mr-3 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    帳號設定
                  </span>
                </DropdownMenuItem> */}
              </div>

              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800/50 m-0" />

              <div className="p-2">
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-bold text-sm">登出</span>
                </DropdownMenuItem>
              </div>
            </>
          ) : (
            // ================= 未登入狀態選單 =================
            <>
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  歡迎光臨
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  登入以享受專屬會員服務
                </span>
              </div>

              <div className="p-2 space-y-1">
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:bg-zinc-100 dark:focus:bg-zinc-800/50 transition-colors flex items-center"
                  onClick={() => handleNavigation("/login")}
                >
                  <LogIn className="mr-3 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    會員登入
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 focus:bg-zinc-100 dark:focus:bg-zinc-800/50 transition-colors flex items-center"
                  onClick={() => handleNavigation("/register")}
                >
                  <UserPlus className="mr-3 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    立即註冊
                  </span>
                </DropdownMenuItem>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

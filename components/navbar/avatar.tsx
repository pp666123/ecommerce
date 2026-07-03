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
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function AvatarCom() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 處理 Hydration

  const { user, setUser, checkAuth } = useAuthStore();

  // 元件掛載後檢查驗證狀態
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsOpen(false);
      toast.success("已成功登出", { description: "期待您再次光臨。" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("登出失敗，請稍後再試");
    }
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  // 確保在伺服器端渲染時不產生不一致的 UI
  if (!isMounted) {
    return (
      <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const isLoggedIn = !!user;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="cursor-pointer h-12 w-12 relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          variant="ghost"
          size="icon"
        >
          <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
            <AvatarImage
              src={isLoggedIn ? avatarImg.src : undefined}
              alt="會員頭像"
              className="object-cover"
            />
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
          {isLoggedIn && user ? (
            // ================= 已登入狀態 =================
            <>
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  {user.username}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {user.email}
                </span>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-bold text-sm">登出</span>
                </DropdownMenuItem>
              </div>
            </>
          ) : (
            // ================= 未登入狀態 =================
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
                  className="cursor-pointer rounded-xl py-3 px-3 transition-colors flex items-center"
                  onClick={() => handleNavigation("/login")}
                >
                  <LogIn className="mr-3 h-4 w-4" />
                  <span className="font-bold text-sm">會員登入</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl py-3 px-3 transition-colors flex items-center"
                  onClick={() => handleNavigation("/register")}
                >
                  <UserPlus className="mr-3 h-4 w-4" />
                  <span className="font-medium text-sm">立即註冊</span>
                </DropdownMenuItem>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

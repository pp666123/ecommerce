"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import avatarImg from "@/assets/image-avatar.png";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function AvatarCom() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { user, setUser, checkAuth } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsOpen(false);
      toast.success("已成功登出");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("登出失敗");
    }
  };

  if (!isMounted) {
    return <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />;
  }

  const isLoggedIn = !!user;

  // 如果未登入，直接渲染一個按鈕，點擊跳轉登入
  if (!isLoggedIn) {
    return (
      <Button
        className="h-12 w-12 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        variant="ghost"
        size="icon"
        onClick={() => router.push("/login")}
      >
        <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // 已登入狀態，維持原有的下拉選單
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-12 w-12 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          variant="ghost"
          size="icon"
        >
          <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
            <AvatarImage src={avatarImg.src} alt="會員頭像" className="object-cover" />
            <AvatarFallback><User size={18} /></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950"
      >
        <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
          <p className="font-bold text-sm">{user.username}</p>
          <p className="text-xs text-zinc-500">{user.email}</p>
        </div>
        <DropdownMenuItem 
          className="cursor-pointer rounded-xl text-red-600 py-3" 
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" /> 登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
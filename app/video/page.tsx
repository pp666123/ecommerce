"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Lock, Film, ChevronLeft } from "lucide-react";
import Link from "next/link";
import HlsPlayer from "@/components/video/HlsPlayer";

// 引入我們剛剛自己建立的 HlsPlayer 元件

export default function VideoPage() {
  const router = useRouter();
  const { user, isInitialized, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const internalVideoUrl = "/api/video/test/output.m3u8";

  useEffect(() => {
    const verifyAccess = async () => {
      if (!isInitialized) {
        await checkAuth();
      }
      setIsLoading(false);
    };
    verifyAccess();
  }, [isInitialized, checkAuth]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        {/* 未登入的鎖頭畫面 */}
        <div className="text-center max-w-md w-full bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-zinc-900 dark:text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            會員限定內容
          </h2>
          <p className="text-zinc-500 mb-8">
            您必須登入後才能觀看本區的獨家影音內容。
          </p>
          <Link
            href="/auth/login"
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-medium rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            立即登入
          </Link>
        </div>
      </div>
    );
  }

  // GCP 儲存桶中已轉碼完成的 .m3u8 檔案網址
  // 請確認網址路徑是否正確對應你剛才轉好的檔案 (例如 test 資料夾下的 output.m3u8)
  const gcpVideoUrl =
    "https://storage.googleapis.com/processed-videos-video-worker-2026/test/output.m3u8";

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-12 mt-6 md:mt-8 min-h-screen">
      <div className="mb-6">
        <Link
          href="/collections"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回選物
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Film className="w-6 h-6 text-zinc-900 dark:text-white" />
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          會員專屬影音
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 影片 1 */}
        <div className="space-y-3">
          {/* 使用我們自己的 HlsPlayer 替換掉原本的 Cloudflare Stream */}
          <HlsPlayer src={internalVideoUrl} />
          
          <div className="mt-4">
            <span className="inline-block px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-md mb-2">
              流暢串流
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              GCP 自動轉碼測試影片
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              這支影片是由我們自己架設的 Cloud Run
              轉碼引擎在背景自動處理並切割的。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

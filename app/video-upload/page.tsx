"use client";

import { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"; // 假設你使用 shadcn 的進度條
import { Upload, Pause, Play, CheckCircle } from "lucide-react";

export default function TusUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // 用來持久保存 tus.Upload 實體，以便隨時控制暫停與開始
  const uploadRef = useRef<tus.Upload | null>(null);

  const startTusUpload = async () => {
    if (!file) return toast.error("請先選取影片檔案");

    setIsUploading(true);
    setIsPaused(false);

    try {
      // Step 1: 先向後端申請這支影片專屬的 Cloudflare TUS 上傳節點
      const res = await fetch("/api/upload-tus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadLength: file.size,
          fileName: file.name,
        }),
      });

      const { uploadUrl, error } = await res.json();
      if (error || !uploadUrl) throw new Error(error || "無法取得節點");

      // Step 2: 初始化 tus-js-client 的上傳核心
      const upload = new tus.Upload(file, {
        // 直接對準 Cloudflare 發給我們的專屬位置上傳，不再經過我們的 Server 頻寬
        endpoint: uploadUrl, 
        uploadUrl: uploadUrl, // 強制鎖定 URL，確保斷點續傳精確對位
        chunkSize: 20 * 1024 * 1024, // 💡 設定每個切片碎片大小為 20MB
        retryDelays: [0, 1000, 3000, 5000], // 當網路瞬斷，自動在 1, 3, 5 秒後發起重試
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: (err) => {
          console.error("上傳失敗:", err);
          toast.error(`上傳發生中斷: ${err.message}`);
          setIsUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
          setProgress(percentage);
        },
        onSuccess: () => {
          toast.success("影片全部切片上傳成功！");
          setIsUploading(false);
          // 這裡可以透過正規表達式或字串分割，從 uploadUrl 中把 Cloudflare Video ID 拔出來
          // 例如 URL 通常長這樣：https://api.cloudflare.com/client/v4/accounts/xxx/stream/VIDEO_ID
          const urlParts = uploadUrl.split("/");
          const videoId = urlParts[urlParts.length - 1];
          console.log("上傳完成，這群影片的 Video ID 為:", videoId);
          
          // ✨ 在這裡寫入你的資料庫 (例如呼叫 API 把 videoId 存入影片列表)
        },
      });

      uploadRef.current = upload;
      
      // Step 3: 正式啟動上傳流程
      upload.start();

    } catch (err: any) {
      toast.error(err.message || "初始化失敗");
      setIsUploading(false);
    }
  };

  // 暫停按鈕邏輯
  const handlePause = () => {
    if (uploadRef.current) {
      uploadRef.current.abort(); // TUS 的 abort 會安全中止當前切片傳輸，並保存已完成的進度
      setIsPaused(true);
      toast.info("上傳已暫停");
    }
  };

  // 恢復續傳按鈕邏輯
  const handleResume = () => {
    if (uploadRef.current) {
      setIsPaused(false);
      uploadRef.current.start(); // 自動比對 Offset 續傳
      toast.success("正在恢復續傳...");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">大檔案安全影音上傳</h1>
        <p className="text-sm text-zinc-500 mt-1">支援 4K、長影片。採用工業級 TUS 斷點續傳技術，無懼任何網路斷線。</p>
      </div>

      <div className="p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-center">
        <input
          type="file"
          accept="video/*"
          id="tus-file-input"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setProgress(0);
          }}
          disabled={isUploading}
        />
        <label htmlFor="tus-file-input" className="cursor-pointer space-y-2 block">
          <Upload className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {file ? `已選擇：${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : "點擊選取或拖曳影片檔案"}
          </p>
        </label>
      </div>

      {isUploading && (
        <div className="space-y-2 animate-in fade-in">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-zinc-600">{isPaused ? "已暫停" : "切片同步中..."}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex gap-4">
        {!isUploading ? (
          <button
            onClick={startTusUpload}
            disabled={!file}
            className="flex-1 h-12 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-white" /> 開始工業級上傳
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={handlePause}
                className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4 fill-zinc-900" /> 模擬/手動暫停
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex-1 h-12 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> 點擊恢復續傳
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
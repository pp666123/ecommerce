"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Upload, Pause, Play, CheckCircle, RefreshCw } from "lucide-react";

export default function ResumableUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // 用來中途取消/暫停 HTTP 請求的核心控制器
  const abortControllerRef = useRef<AbortController | null>(null);

  // 簡單快速的檔案特徵碼產生器 (結合檔名、大小與修改時間)
  const generateFileHash = (f: File) => {
    return `hash-${f.size}-${f.lastModified}-${f.name.replace(/[^a-zA-Z0-9]/g, "")}`;
  };

  const startUpload = async () => {
    if (!file) return toast.error("請先選取影片檔案");

    setIsUploading(true);
    setIsPaused(false);
    abortControllerRef.current = new AbortController();

    const fileHash = generateFileHash(file);
    const storageKey = `gcs_url_${fileHash}`;
    
    // 先從本地瀏覽器記憶體找看看，有沒有上一次傳到一半的 GCP 專屬網址
    let uploadUrl = localStorage.getItem(storageKey);
    let startOffset = 0;

    try {
      if (uploadUrl) {
        console.log("🔍 發現上一次的上傳會話，正在向 GCP 查詢歷史斷點...");
        // 🚨 核心機制：問路請求 (向 GCP 發送空 PUT 詢問進度)
        const checkRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Range": `bytes */${file.size}` },
          signal: abortControllerRef.current.signal
        });

        if (checkRes.status === 308) {
          const rangeHeader = checkRes.headers.get("Range");
          if (rangeHeader) {
            // Range 格式通常為 bytes=0-456789，我們切出後面的數字並 +1，就是我們要接續的位置
            const parts = rangeHeader.split("-");
            startOffset = parseInt(parts[1], 10) + 1;
            console.log(`🎯 查詢成功！GCP 已有資料，將從 ${ (startOffset / 1024 / 1024).toFixed(1) } MB 處無縫續傳`);
          }
        } else if (checkRes.status === 200 || checkRes.status === 201) {
          setProgress(100);
          setIsUploading(false);
          return toast.success("偵測到此檔案先前已完整上傳成功！");
        } else {
          // 404 或其他錯誤，代表 GCP 那邊的 Session 已經過期，必須重新申請
          uploadUrl = null;
        }
      }

      // 如果是全新檔案，或者 Session 過期了，就向後端要新網址
      if (!uploadUrl) {
        console.log("🚀 全新檔案，正在向後端註冊 GCP 上傳任務...");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: file.name, contentType: file.type, fileHash }),
          signal: abortControllerRef.current.signal
        });

        const data = await res.json();
        if (data.error || !data.uploadUrl) throw new Error(data.error || "無法取得節點");
        
        uploadUrl = data.uploadUrl;
        localStorage.setItem(storageKey, uploadUrl!); // 存入記憶體供下次續傳使用
      }

      if (!uploadUrl) throw new Error("取得上傳網址失敗");

      // 執行實體直傳 (只切出尚未上傳的後半段)
      const fileSlice = file.slice(startOffset);
      
      // 使用原生 XMLHttpRequest 來精準監聽 Progress
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      
      // 告訴 GCP 這一包資料是從哪裡開始到哪裡
      xhr.setRequestHeader("Content-Range", `bytes ${startOffset}-${file.size - 1}/${file.size}`);
      xhr.setRequestHeader("Content-Type", file.type);

      // 監聽進度條
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const totalUploaded = startOffset + event.loaded;
          const percentage = Math.round((totalUploaded / file.size) * 100);
          setProgress(percentage);
        }
      };

      // 監聽上傳完成
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          toast.success("影片無縫直傳 GCP 成功！");
          localStorage.removeItem(storageKey); // 上傳成功，清除快取
          setIsUploading(false);
        } else {
          console.error("GCP 回傳錯誤狀態:", xhr.status, xhr.responseText);
          toast.error("上傳失敗，請稍後重試");
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        if (!isPaused) {
          toast.error("網路連線中斷");
          setIsUploading(false);
        }
      };

      // 綁定暫停訊號
      abortControllerRef.current.signal.addEventListener("abort", () => {
        xhr.abort();
      });

      xhr.send(fileSlice);

    } catch (err: any) {
      if (err.name !== "AbortError") {
        toast.error(err.message || "初始化失敗");
        setIsUploading(false);
      }
    }
  };

  const handlePause = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // 瞬間切斷當前傳輸
      setIsPaused(true);
      toast.info("已安全暫停，當前進度已保存於雲端");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">GCP 原生斷點續傳演練</h1>
        <p className="text-sm text-zinc-500 mt-1">結合前端 File Fingerprint 與 Google 308 握手機制，真正實現秒級續傳。</p>
      </div>

      <div className="p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-center">
        <input
          type="file"
          accept="video/*"
          id="resumable-file-input"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setProgress(0);
            setIsUploading(false);
            setIsPaused(false);
          }}
          disabled={isUploading && !isPaused}
        />
        <label htmlFor="resumable-file-input" className="cursor-pointer space-y-2 block">
          <Upload className="w-10 h-10 mx-auto text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {file ? `已選擇：${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : "點擊選取影片檔案"}
          </p>
        </label>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-zinc-600">{isPaused ? "已暫停（快取中斷點）" : "安全直傳 GCP 儲存桶中..."}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex gap-4">
        {!isUploading || isPaused ? (
          <button
            onClick={startUpload}
            disabled={!file}
            className="flex-1 h-12 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-white" /> {isPaused ? "恢復續傳 (秒級對接)" : "開始直傳"}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4 fill-zinc-900" /> 點擊安全暫停
          </button>
        )}
      </div>
    </div>
  );
}
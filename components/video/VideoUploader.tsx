"use client";
import { useState } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import Dashboard from "@uppy/react/dashboard";
// 引入 Uppy 的樣式
// import "@uppy/core/dist/style.min.css";
// import "@uppy/dashboard/dist/style.min.css";
import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.css';

export default function VideoUploader() {
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["video/*"], // 限制只能選影片檔
      },
    });

    // 🔥 關鍵修改：使用 XHRUpload 來處理動態網址直傳
    uppyInstance.use(XHRUpload, {
      method: "PUT",
      formData: false, // 🚨 極度重要：GCP 儲存桶只接受 Raw Body，不接受 FormData

      endpoint: async (file) => {
        // ✅ 修正 1：排除陣列可能性，讓 TypeScript 安心
        const singleFile = Array.isArray(file) ? file[0] : file;

        // 若因為某些極端原因沒有拿到檔案，提早報錯
        if (!singleFile) throw new Error("沒有找到可上傳的檔案");

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // 現在 TypeScript 知道 singleFile 是單一物件了，可以安全取用 name 與 type
            fileName: singleFile.name,
            contentType: singleFile.type,
          }),
        });

        const data = await response.json();

        if (!data.uploadUrl) {
          throw new Error("無法取得上傳網址");
        }

        return data.uploadUrl;
      },

      headers: (file) => {
        // ✅ 修正 2：這裡也要做一樣的處理
        const singleFile = Array.isArray(file) ? file[0] : file;
        return {
          "Content-Type": singleFile?.type || "video/mp4",
        };
      },
    });

    uppyInstance.on("upload-success", (file, response) => {
      console.log("✅ 檔案安全抵達 GCS，轉碼器已自動啟動！", file?.name);
    });

    return uppyInstance;
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
        🎬 上傳原始影片
      </h2>
      <p className="text-sm text-zinc-500 mb-6">
        直傳 GCP 儲存桶，不吃 Vercel 流量。上傳完成後系統將自動進行切片轉碼。
      </p>
      <div className="uppy-wrapper custom-uppy-theme">
        <Dashboard
          uppy={uppy}
          width="100%"
          height={350}
          proudlyDisplayPoweredByUppy={false}
        />
      </div>
    </div>
  );
}

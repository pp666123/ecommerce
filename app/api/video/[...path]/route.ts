// app/api/video/[...path]/route.ts
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

// 宣告在全域，讓每一次 API 請求都能重複使用同一個 Storage 實例
let storage: Storage;

// 系統啟動時：檢查是否在 Vercel 環境且擁有 Base64 憑證
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    // 1. 將 Base64 字串解碼回原始的 JSON 字串
    const credentials = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString();
    
    // 2. 塞回標準的環境變數，讓底層 Google SDK 也能讀到
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(JSON.parse(credentials));
    
    // 3. 初始化 Storage 實例
    const authClient = JSON.parse(credentials);
    storage = new Storage({
      projectId: authClient.project_id,
      credentials: authClient
    });
    console.log("✅ [GCP Proxy] 成功從 Vercel Base64 環境變數載入憑證");
  } catch (error) {
    console.error("❌ [GCP Proxy] 無法解析 GCP Base64 憑證，請檢查 Vercel 設定:", error);
    // 發生錯誤時退回預設模式
    storage = new Storage({ projectId: 'video-worker-2026' });
  }
} else {
  // 本地開發時，使用你剛才 gcloud login 產生的預設憑證
  storage = new Storage({ projectId: 'video-worker-2026' });
  console.log("✅ [GCP Proxy] 使用本地或預設的 GCP 憑證");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. 先 await 解開 params (Next.js 15+ 規範)
  const resolvedParams = await params;
  
  // 2. 組合出 GCP 儲存桶中的真實檔案路徑
  const filePath = resolvedParams.path.join('/');
  const bucketName = 'processed-videos-video-worker-2026';
  const file = storage.bucket(bucketName).file(filePath);

  try {
    const [exists] = await file.exists();
    if (!exists) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    // 建立 GCS 讀取串流
    const stream = file.createReadStream();

    // 轉換為 Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    // 動態判斷 MIME Type
    const contentType = filePath.endsWith('.m3u8') 
      ? 'application/vnd.apple.mpegurl' 
      : 'video/MP2T';

    // m3u8 播放清單不快取，ts 碎片檔永久快取
    const cacheControl = filePath.endsWith('.m3u8')
      ? 'no-store'
      : 'public, max-age=31536000, immutable';

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
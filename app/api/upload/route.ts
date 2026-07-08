// app/api/upload/route.ts
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

let storage: Storage;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const credentials = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString();
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(JSON.parse(credentials));
    const authClient = JSON.parse(credentials);
    storage = new Storage({ projectId: authClient.project_id, credentials: authClient });
  } catch (error) {
    storage = new Storage({ projectId: 'video-worker-2026' });
  }
} else {
  storage = new Storage({ projectId: 'video-worker-2026' });
}

export async function POST(req: Request) {
  try {
    // 🔥 關鍵：接收前端計算好的 fileHash
    const { fileName, contentType, fileHash } = await req.json();

    if (!fileHash || !fileName) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const bucketName = 'raw-videos-video-worker-2026';
    const bucket = storage.bucket(bucketName);
    
    // 🔥 關鍵：用 fileHash 代替 Date.now()，確保檔名唯一且固定
    const uniqueFileName = `uploads/${fileHash}-${fileName}`;
    const file = bucket.file(uniqueFileName);

    const [uploadUrl] = await file.createResumableUpload({
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-app.vercel.app' 
        : 'http://localhost:3000',
      metadata: {
        contentType: contentType || 'video/mp4',
      },
    });

    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error("GCP Resumable API Error:", error);
    return NextResponse.json({ error: "伺服器初始化異常" }, { status: 500 });
  }
}
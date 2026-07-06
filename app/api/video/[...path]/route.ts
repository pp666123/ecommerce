// app/api/video/[...path]/route.ts
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

const storage = new Storage({ projectId: 'video-worker-2026' });

// 1. 將型別定義改為 Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 2. 先 await 解開 params
  const resolvedParams = await params;
  
  // 3. 現在就可以安全地使用 join 了！
  const filePath = resolvedParams.path.join('/');
  const bucketName = 'processed-videos-video-worker-2026';
  const file = storage.bucket(bucketName).file(filePath);

  try {
    const [exists] = await file.exists();
    if (!exists) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const stream = file.createReadStream();

    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    const contentType = filePath.endsWith('.m3u8') 
      ? 'application/vnd.apple.mpegurl' 
      : 'video/MP2T';

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
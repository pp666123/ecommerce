'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string; // .m3u8 檔案的網址
}

export default function HlsPlayer({ src }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    // 1. 檢查瀏覽器是否支援 MediaSource Extensions (MSE) - 大部分非蘋果設備
    if (Hls.isSupported()) {
      hls = new Hls({
        // 這裡可以做進階設定，例如初始頻寬、重試邏輯等
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS 解析成功，準備就緒！');
        // 可選：如果你希望載入完自動播放，可打開下方註解
        // video.play().catch(e => console.log('自動播放被阻擋', e));
      });
    } 
    // 2. 處理原生支援 HLS 的瀏覽器 (如 iOS Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    // 3. 清理函數：組件卸載時銷毀 Hls 實例，避免記憶體洩漏
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg bg-black">
      <video
        ref={videoRef}
        controls
        className="w-full h-auto"
        style={{ aspectRatio: '16/9' }}
      />
    </div>
  );
}
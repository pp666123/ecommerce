Cloudflare Stream 支援 TUS 協定（可斷點續傳）。前端實作時需要安裝 tus-js-client 套件，它會把大影片切成好幾個 Chunk 分批傳送給 Cloudflare，就算斷線也能從斷掉的地方接續傳。這部分的邏輯會稍微複雜一點，通常是正式商轉且允許使用者自行上傳長影片時才會導入。

選擇 Cloudflare Stream 搭配 HLS 是極度聰明且符合業界實務的決定。

TUS 的核心原理是：前端不會一次性發送整支大影片，而是把檔案切成多個微小的「碎片（Chunks）」分批上傳。如果傳到 50% 時網路斷線，重新連線後，前端會向伺服器發送一個詢問請求（問：你那邊收到多少位元組了？），伺服器回傳當前的偏移量（Offset），前端就從該偏移量繼續上傳剩下的碎片，完全不需要從頭來過。   


方案二：Cloudflare Stream (以「分鐘」計費)
Cloudflare 的計費方式非常粗暴簡單，它完全不在乎你的影片檔案有多大、畫質有多高（1080p 或 4K 都一樣），只看影片的「長度」。

基本費： $0（用多少算多少）。

儲存費： 每 1,000 分鐘 $5 美金 / 月。

觀看費： 觀眾每看 1,000 分鐘 $1 美金 / 月。

優勢： 預測成本超級容易，且對於提供 4K 高畫質大檔案影片的平台來說，簡直是超級大放送。

方案三：GCP Cloud CDN + Load Balancer (以「容量 GB」計費)
GCP 走的是傳統雲端服務的計費法，畫質越高、檔案越大，費用就越貴，而且有一筆跑不掉的基本開銷。

基礎維持費： 負載平衡器每月固定約 $18 美金（約台幣 550 元），就算沒人看也要付。

儲存費 (GCS)： 存放在台灣 (asia-east1)，每 GB 約 $0.023 美金 / 月。

流量費 (CDN Egress)： 台灣/亞洲區的 CDN 傳輸費相對較貴，每流出 1 GB 約 $0.08 ~ $0.12 美金。

優勢： 當你擁有海量「極短、低畫質（檔案極小）」的影片，且觀看次數普普通通時，GCP 的純儲存成本會比 Cloudflare 便宜。


步驟 4：🚨 打通 GCP 的上傳通道 (CORS 設定)
這是最後、也是最容易被遺漏的一關。因為前端瀏覽器要直接把影片的 Chunk 推送給 GCP，GCP 預設會阻擋跨網域的 PUT 請求。我們必須對 raw-videos 儲存桶開放 CORS。

請在你的電腦隨便建立一個 upload-cors.json 檔案：

JSON
[
  {
    "origin": ["http://localhost:3000"], 
    "method": ["PUT", "OPTIONS"],
    "responseHeader": ["Content-Type", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
(注意：未來部署到 Vercel 時，記得把你的正式網域加進 origin 陣列中再跑一次更新)

然後在終端機執行這行指令更新權限：

Bash
gcloud storage buckets update gs://raw-videos-video-worker-2026 --cors-file=upload-cor
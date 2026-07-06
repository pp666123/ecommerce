import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const token = process.env.CLOUDFLARE_API_TOKEN;

    // 讀取前端傳來的檔案總大小 (TUS 協定硬性要求必須在開頭宣告長度)
    const { uploadLength, fileName } = await req.json();

    if (!uploadLength) {
      return NextResponse.json({ error: "缺少檔案長度參數" }, { status: 400 });
    }

    // 向 Cloudflare Stream 核心註冊 TUS 上傳任務
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Tus-Resumable": "1.0.0", // 宣告使用 TUS 協定
          "Upload-Length": String(uploadLength), // 告訴 Cloudflare 檔案有多大
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            name: fileName || "untitled_video",
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Cloudflare TUS 錯誤:", errText);
      return NextResponse.json(
        { error: "無法初始化上傳任務" },
        { status: 500 },
      );
    }

    // 關鍵：Cloudflare 會在 Response Headers 的 'Location' 欄位給予這支影片專屬的 TUS 上傳 URL
    const tusLocation = response.headers.get("Location");

    if (!tusLocation) {
      return NextResponse.json({ error: "未能取得上傳節點" }, { status: 500 });
    }

    // 將這個極度重要的一次性專屬上傳 URL 回傳給前端
    return NextResponse.json({ uploadUrl: tusLocation });
  } catch (error) {
    console.error("TUS API Error:", error);
    return NextResponse.json({ error: "伺服器異常" }, { status: 500 });
  }
}

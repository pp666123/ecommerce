// ============================================================
// lib/response.ts
// 統一 API 回應格式
//
// 所有 API route 統一用這裡的 helper 回傳，
// 確保成功和失敗的格式一致，前端只需要判斷 success 欄位。
//
// 成功：{ success: true, data: { ... } }
// 失敗：{ success: false, error: { code: string, message: string } }
// ============================================================

import { NextResponse } from "next/server";

// 定義所有允許的錯誤代碼字串
export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE";

// 映射錯誤代碼到對應的 HTTP 狀態碼
export const STATUS_MAP: Record<ErrorCode, number> = {
  // --- 4xx 客戶端錯誤 (前端/使用者的問題) ---
  BAD_REQUEST: 400, // 請求參數錯誤、少傳欄位或格式不對
  UNAUTHORIZED: 401, // 身分驗證失敗 (例如：未登入、Token 過期或無效)
  FORBIDDEN: 403, // 權限不足 (例如：已登入，但一般會員想打管理員 API)
  NOT_FOUND: 404, // 找不到資源 (例如：查詢不存在的 user_id)
  METHOD_NOT_ALLOWED: 405, // 請求方法不允許 (例如：API 只接受 POST，前端卻用 GET)
  CONFLICT: 409, // 資源衝突 (例如：註冊時 Email 已經被使用)
  UNPROCESSABLE_ENTITY: 422, // 格式對但語意錯 (例如：密碼長度不符合規則、身分證字號邏輯不符)
  TOO_MANY_REQUESTS: 429, // 請求過於頻繁 (也就是你遇到的：API 配額用盡)

  // --- 5xx 伺服器端錯誤 (後端的問題) ---
  INTERNAL_ERROR: 500, // 伺服器內部發生未預期錯誤 (例如：程式當掉、沒捕捉到的 Bug)
  NOT_IMPLEMENTED: 501, // 尚未實作 (例如：API 路由開好了，但裡面的邏輯還沒寫)
  BAD_GATEWAY: 502, // 閘道器錯誤 (通常是 Nginx 或上游微服務掛掉沒回應)
  SERVICE_UNAVAILABLE: 503, // 服務暫時無法使用 (例如：系統維護中、資料庫連線數爆滿)
};

// 成功回應
export function ok<T>({
  data,
  message,
  status = 200,
}: {
  data?: T;
  message?: string;
  status?: number;
}) {
  return NextResponse.json(
    {
      success: true,
      data, // 這裡拿到的就是你傳進來的 data 內容
      ...(message && { message }),
    },
    { status },
  );
}

// 失敗回應
export function fail(code: ErrorCode | number, message: string) {
  // 如果是數字就直接用，如果是字串就查表
  const statusCode = typeof code === "number" ? code : STATUS_MAP[code] || 500;

  // 決定回傳給前端的錯誤代碼標籤
  const errorCodeStr = typeof code === "string" ? code : "API_ERROR";

  return NextResponse.json(
    { success: false, error: { code: errorCodeStr, message } },
    { status: statusCode },
  );
}

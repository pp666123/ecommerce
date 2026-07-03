// src/app/api/verify/route.ts (假設的路徑)
import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 取得網址列上的 token 參數
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      // 找不到 Token 時，回傳錯誤狀態
      return fail("BAD_REQUEST", "無效的驗證連結");
    }

    // 在資料庫中尋找符合且未過期的 token
    const result = await pool.query(
      "SELECT id FROM users WHERE verification_token = $1 AND token_expires_at > NOW()",
      [token]
    );

    if (result.rows.length === 0) {
      // 找不到或已過期
      return fail("UNAUTHORIZED", "驗證連結無效或已過期");
    }

    const userId = result.rows[0].id;

    // 更新使用者狀態，並清空 token
    await pool.query(
      `UPDATE users 
       SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL 
       WHERE id = $1`,
      [userId]
    );

    // 驗證成功，回傳成功 JSON
    return ok({ message: "驗證成功，請重新登入" });
  } catch (error) {
    console.error("Verify API Error:", error);
    return fail("INTERNAL_ERROR", "伺服器發生錯誤");
  }
}
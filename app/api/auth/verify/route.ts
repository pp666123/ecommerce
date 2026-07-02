import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 取得網址列上的 token 參數
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=無效的驗證連結`);
    }

    // 在資料庫中尋找符合且未過期的 token
    const result = await pool.query(
      "SELECT id FROM users WHERE verification_token = $1 AND token_expires_at > NOW()",
      [token]
    );

    if (result.rows.length === 0) {
      // 找不到或已過期
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=驗證連結無效或已過期`);
    }

    const userId = result.rows[0].id;

    // 更新使用者狀態，並清空 token
    await pool.query(
      `UPDATE users 
       SET is_verified = TRUE, verification_token = NULL, token_expires_at = NULL 
       WHERE id = $1`,
      [userId]
    );

    // 驗證成功，導向登入頁並帶上 success 參數
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?verified=true`);
  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=伺服器錯誤`);
  }
}
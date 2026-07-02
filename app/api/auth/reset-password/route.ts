import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return fail("BAD_REQUEST", "資料不完整");
    }

    // 檢查密碼格式 (與註冊相同)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return fail(
        "UNPROCESSABLE_ENTITY",
        "密碼必須至少 8 個字元，且包含英文大小寫字母"
      );
    }

    // 1. 檢查 Token 是否存在且未過期
    const userQuery = await pool.query(
      `SELECT id FROM users 
       WHERE reset_token = $1 AND reset_token_expires_at > NOW()`,
      [token]
    );

    if (userQuery.rows.length === 0) {
      return fail("UNAUTHORIZED", "重設連結已失效或不正確，請重新申請");
    }

    const userId = userQuery.rows[0].id;

    // 2. 雜湊新密碼
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 3. 更新密碼，並清空 Token 防止重複使用
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL 
       WHERE id = $2`,
      [passwordHash, userId]
    );

    return ok({ message: "密碼重設成功，請使用新密碼登入" });
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return fail("INTERNAL_ERROR", "重設密碼失敗，請稍後再試");
  }
}
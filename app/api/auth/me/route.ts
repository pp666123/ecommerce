import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ok, fail } from "@/lib/response";
// 引入與註冊相同的 pool 實體
import pool from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return fail("UNAUTHORIZED", "未登入");

    // 1. 驗證並解碼 JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 2. 使用原生 SQL 語法向 PostgreSQL 查詢最新欄位
    // 使用 $1 參數化查詢防止 SQL 注入
    const userResult = await pool.query(
      `SELECT id, username, email, default_carrier_code 
       FROM users 
       WHERE id = $1`,
      [payload.id],
    );

    // 3. 檢查資料庫中是否存在該使用者
    if (userResult.rows.length === 0) {
      return fail("UNAUTHORIZED", "找不到該使用者");
    }

    // 4. 取得查詢出的第一筆資料
    const user = userResult.rows[0];

    // 5. 回傳包含 default_carrier_code 的使用者資訊
    return ok({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        default_carrier_code: user.default_carrier_code, // 成功從 DB 同步
      },
    });
  } catch (error) {
    console.error("GetMe API Error:", error);
    return fail("UNAUTHORIZED", "憑證無效或已過期");
  }
}

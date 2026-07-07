import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    // 1. 接收前端傳來的 accessToken (記得型別定義要跟著改成 accessToken)
    const { accessToken } = await req.json();

    if (!accessToken) {
      return fail("BAD_REQUEST", "缺少 Google 授權憑證");
    }

    // 2. 拿著 accessToken 去呼叫 Google UserInfo API 獲取使用者資料
    const res = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          // 必須將 token 放在 Authorization Header 中
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );

    const payload = await res.json();

    // 如果 Token 無效或已過期，Google 會回傳錯誤狀態碼
    if (!res.ok) {
      console.error("Google UserInfo Error:", payload);
      return fail("UNAUTHORIZED", "Google 驗證失敗或授權已過期");
    }

    const { email, name } = payload;

    // 確保有拿到 email 作為資料庫的 Unique Key
    if (!email) {
      return fail("BAD_REQUEST", "無法獲取 Google 帳號的電子郵件");
    }

    // ==========================================
    // 以下邏輯完全維持你原本完美的寫法，原封不動！
    // ==========================================

    // 3. 資料庫邏輯 (查詢或建立)
    const result = await pool.query(
      `INSERT INTO users (username, email, provider, is_verified)
         VALUES ($1, $2, 'google', TRUE)
         ON CONFLICT (email, provider) 
         DO UPDATE SET username = EXCLUDED.username
         RETURNING id, username, email;`,
      [name || "Google 用戶", email],
    );
    const user = result.rows[0];

    // 4. 簽發 JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // 5. 回傳 Response 並設定 Cookie
    const response = ok({ message: "Google 登入成功" });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("API Auth Error:", error);
    return fail("INTERNAL_ERROR", "伺服器內部錯誤");
  }
}
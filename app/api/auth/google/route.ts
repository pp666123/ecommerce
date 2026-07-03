import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    // 1. 直接呼叫 Google 官方 API 驗證
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
    );
    const payload = await res.json();

    if (!res.ok || payload.aud !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      // 替換為統一錯誤格式
      return fail("UNAUTHORIZED", "Google 驗證失敗");
    }

    const { email, name } = payload;

    // 2. 資料庫邏輯 (查詢或建立)
    const result = await pool.query(
      `INSERT INTO users (username, email, provider, is_verified)
         VALUES ($1, $2, 'google', TRUE)
         ON CONFLICT (email, provider) 
         DO UPDATE SET username = EXCLUDED.username
         RETURNING id, username, email;`,
      [name || "Google 用戶", email],
    );
    const user = result.rows[0];

    // 3. 簽發 JWT
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

    // 4. 回傳 Response 並設定 Cookie
    // 使用 ok 建立回應物件，以便後續掛載 cookie
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
    // 替換為統一錯誤格式
    return fail("INTERNAL_ERROR", "伺服器內部錯誤");
  }
}

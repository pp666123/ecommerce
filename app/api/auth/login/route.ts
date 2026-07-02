import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 修改這裡：明確指定只搜尋「一般密碼註冊 (credentials)」的帳號
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND provider = 'credentials'", 
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return fail("UNAUTHORIZED", "信箱或密碼錯誤");
    }

    // 確保有 password_hash 才能進行比對
    if (!user.password_hash) {
      return fail("UNAUTHORIZED", "信箱或密碼錯誤");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return fail("UNAUTHORIZED", "信箱或密碼錯誤");
    }

    // ==========================================
    // 檢查信箱是否已驗證
    // ==========================================
    if (!user.is_verified) {
      return fail("FORBIDDEN", "請先至您的信箱點擊驗證連結後再登入");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = ok({ message: "登入成功" });
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return fail("INTERNAL_ERROR", "伺服器發生錯誤");
  }
}
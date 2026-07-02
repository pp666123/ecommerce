import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 設定 nodemailer 發信器
const transporter = nodemailer.createTransport({
  service: "gmail", // 這裡以 Gmail 為例
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return fail("BAD_REQUEST", "請填寫所有欄位");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail("BAD_REQUEST", "信箱格式不正確");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return fail(
        "UNPROCESSABLE_ENTITY",
        "密碼必須至少 8 個字元，且包含英文大小寫字母",
      );
    }

    const userExist = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (userExist.rows.length > 0) {
      return fail("CONFLICT", "此信箱已被註冊");
    }

    // 1. 先準備好 Token 與相關資料
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

    // 2. 先嘗試發送郵件 (若失敗，程式會直接跳到 catch)
    await transporter.sendMail({
      from: `"潮流選物官方" <${process.env.SMTP_USER}>`, // 加上"官方"或"客服"，降低廣告感
      to: email,
      subject: "請驗證您的電子郵件帳號",
      html: `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-6">
            <h2 style="color: #000; margin-bottom: 20px;">歡迎加入我們，${username}！</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              感謝您註冊帳號。請點擊下方按鈕來驗證您的電子郵件。此連結將在 24 小時後過期。
            </p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
              驗證我的帳號
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              如果您沒有註冊本網站，請忽略此封信件。
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // 3. 只有在發信成功後，才寫入 DB
    await pool.query(
      `INSERT INTO users (username, email, password_hash, verification_token, token_expires_at) 
       VALUES ($1, $2, $3, $4, $5)`,
      [username, email, passwordHash, verificationToken, tokenExpiresAt],
    );

    return ok({ message: "註冊成功，請至信箱點擊驗證連結" }, 201);
  } catch (error) {
    console.error("Register API Error:", error);
    // 這裡若是發信失敗，使用者會收到伺服器錯誤，DB 則完全沒寫入
    return fail("INTERNAL_ERROR", "註冊失敗，請稍後再試 (發信伺服器異常)");
  }
}

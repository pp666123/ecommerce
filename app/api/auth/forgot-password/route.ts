import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) return fail("BAD_REQUEST", "請輸入電子郵件");

    // 1. 檢查信箱是否存在
    const userQuery = await pool.query(
      "SELECT id, username FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      // 為了資安（防止枚舉攻擊），實務上即使找不到信箱，通常也會回傳成功
      // 但依照你的需求，這裡給予明確錯誤
      return fail("NOT_FOUND", "找不到此電子郵件對應的帳號");
    }

    const user = userQuery.rows[0];

    // 2. 準備 Token (時效設為 1 小時)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小時後
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // 3. 寄送重設密碼信件
    await transporter.sendMail({
      from: `"潮流選物官方" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "【潮流選物】重設您的密碼",
      html: `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-6">
            <h2 style="color: #000; margin-bottom: 20px;">密碼重設要求</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              親愛的 ${user.username} 您好：<br><br>
              我們收到了您重設密碼的請求。請點擊下方按鈕來設定新密碼。此連結將在 1 小時後失效。
            </p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
              重設密碼
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              如果您並未提出此請求，請直接忽略這封信件，您的密碼將不會被更改。
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // 4. 信件發送成功後，才把 Token 寫入資料庫
    await pool.query(
      `UPDATE users SET reset_token = $1, reset_token_expires_at = $2 WHERE email = $3`,
      [resetToken, tokenExpiresAt, email]
    );

    return ok({ message: "重設信件已發送，請檢查您的信箱" });
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return fail("INTERNAL_ERROR", "發送失敗，請稍後再試");
  }
}
"use server";

import nodemailer from "nodemailer";

// 1. 建立 Nodemailer 傳輸器 (與你的參考代碼一致)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function submitContactForm(formData: FormData) {
  try {
    // 2. 從 FormData 提取資料
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // 3. 簡單防呆驗證
    if (!name || !email || !message) {
      return { success: false, message: "請填寫所有必填欄位！" };
    }

    // 4. 準備通知信件內容
    const mailOptions = {
      // from 必須是自己的 SMTP_USER 避免被 Gmail 擋信，名稱可自訂
      from: `"潮流選物網站系統" <${process.env.SMTP_USER}>`, 
      to: process.env.SMTP_USER, // 將客服訊息寄給網站管理員自己
      replyTo: email, // 設定回信地址為填表人的信箱，方便客服直接回覆
      subject: `【客服表單通知】${subject || "無主旨"} - 來自 ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #f97316; margin-top: 0; margin-bottom: 20px;">收到新的客服表單訊息</h2>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0;"><strong>聯絡人姓名：</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>電子郵件：</strong> <a href="mailto:${email}" style="color: #f97316;">${email}</a></p>
              <p style="margin: 0;"><strong>主旨：</strong> ${subject || "未填寫"}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">訊息內容：</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; white-space: pre-wrap; font-size: 15px; border: 1px solid #e5e7eb;">${message}</div>
          </div>
        </body>
        </html>
      `,
    };

    // 5. 執行寄信動作
    await transporter.sendMail(mailOptions);

    // 6. 回傳成功狀態給前端的 ContactForm 元件
    return { success: true, message: "訊息已成功發送！我們會盡快回覆您。" };
    
  } catch (error) {
    console.error("Contact Form Email Error:", error);
    return { success: false, message: "伺服器發送失敗，請稍後再試或直接來電聯繫。" };
  }
}
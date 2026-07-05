import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";

// POST: 建立訂單
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ==========================================
    // 1. 基本必填欄位驗證
    // ==========================================
    const requiredFields = [
      { key: "email", name: "電子郵件" },
      { key: "logistics", name: "物流方式" },
      { key: "shipping_name", name: "收件人姓名" },
      { key: "shipping_phone", name: "聯絡電話" },
      { key: "shipping_address", name: "收件地址" },
      { key: "invoice_type", name: "發票類型" },
      { key: "payment_method", name: "付款方式" },
    ];

    for (const field of requiredFields) {
      // 檢查是否為 undefined、null 或空字串
      if (!body[field.key] || String(body[field.key]).trim() === "") {
        return fail("BAD_REQUEST", `欄位驗證錯誤：缺少「${field.name}」`);
      }
    }

    // ==========================================
    // 2. 金額與購物車內容驗證
    // ==========================================
    if (
      body.subtotal === undefined ||
      body.shipping_fee === undefined ||
      body.order_total === undefined
    ) {
      return fail("BAD_REQUEST", "訂單金額計算錯誤，缺少必要金額參數");
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return fail("BAD_REQUEST", "購物車不能為空");
    }

    // ==========================================
    // 3. 條件式驗證 (發票連動邏輯)
    // ==========================================
    if (body.invoice_type === "company") {
      if (!body.company_tax_id || !body.company_name || !body.invoice_address) {
        return fail(
          "BAD_REQUEST",
          "選擇公司發票時，統編、抬頭與發票地址皆為必填",
        );
      }
    }

    if (body.invoice_type === "personal" && body.carrier_type === "mobile") {
      if (!body.carrier_code) {
        return fail("BAD_REQUEST", "選擇手機載具時，請務必提供手機條碼");
      }
    }

    // ==========================================
    // 4. 通過驗證，開始寫入資料庫
    // ==========================================
    const query = `
      INSERT INTO orders (
        user_id, email, logistics, shipping_name, shipping_phone, 
        shipping_address, order_remark, invoice_type, carrier_type, 
        carrier_code, company_tax_id, company_name, invoice_address, 
        payment_method, subtotal, shipping_fee, order_total, items
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id
    `;

    // 陣列轉為 JSON 字串
    const itemsJson = JSON.stringify(body.items);

    const result = await pool.query(query, [
      body.user_id || null, // user_id 允許為 null (訪客結帳)
      body.email,
      body.logistics,
      body.shipping_name,
      body.shipping_phone,
      body.shipping_address,
      body.order_remark || null, // 備註允許空值
      body.invoice_type,
      body.carrier_type || null,
      body.carrier_code || null,
      body.company_tax_id || null,
      body.company_name || null,
      body.invoice_address || null,
      body.payment_method,
      body.subtotal,
      body.shipping_fee,
      body.order_total,
      itemsJson,
    ]);

    return ok({
      data: { id: result.rows[0].id },
      message: "訂單建立成功",
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return fail("INTERNAL_ERROR", "訂單建立失敗，系統發生異常");
  }
}

// GET: 獲取該使用者的所有訂單 (用於「我的訂單」頁面)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return fail("BAD_REQUEST", "缺少使用者 ID");
    }

    const query = `
      SELECT * FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [user_id]);

    return ok({ data: result.rows });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return fail("INTERNAL_ERROR", "無法獲取訂單資料");
  }
}

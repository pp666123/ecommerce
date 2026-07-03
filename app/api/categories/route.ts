// src/app/api/categories/route.ts
import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = "SELECT * FROM categories ORDER BY id ASC";
    const result = await pool.query(query);

    // 使用自訂的 ok 函式包裝資料回傳
    return ok({ data: result.rows });
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return fail("INTERNAL_ERROR", "無法獲取分類資料");
  }
}

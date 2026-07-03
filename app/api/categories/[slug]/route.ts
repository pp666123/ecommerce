// src/app/api/categories/[slug]/route.ts
import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";

export async function GET(
  req: Request,
  // 在 Next.js App Router 中，動態路由的 params 是一個 Promise
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const query = "SELECT * FROM categories WHERE slug = $1 LIMIT 1";
    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      // 找不到該分類時回傳錯誤
      return fail("NOT_FOUND", "找不到此分類");
    }

    return ok({ data: result.rows[0] });
  } catch (error) {
    console.error("Fetch Category Detail Error:", error);
    return fail("INTERNAL_ERROR", "無法獲取分類詳細資料");
  }
}

import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import { Product } from "@/services/api";

// GET: 獲取產品列表
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "8";
    const featured = searchParams.get("featured");
    const categorySlug = searchParams.get("category"); // 🔥 新增：取得分類 slug

    let query = "SELECT * FROM products";
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (featured === "true") {
      whereClauses.push("is_featured = TRUE");
    }

    // 🔥 新增：如果前端有傳入分類 slug，則加上關聯條件
    if (categorySlug) {
      params.push(categorySlug);
      // 利用子查詢，用 slug 找出對應的 id
      whereClauses.push(
        `category_id = (SELECT id FROM categories WHERE slug = $${params.length})`,
      );
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    // 將 limit 推入參數陣列
    params.push(parseInt(limit, 10));
    query += " ORDER BY created_at DESC LIMIT $" + params.length;

    const result = await pool.query<Product>(query, params);

    return ok({ data: result.rows });
  } catch (error: unknown) {
    console.error("Fetch Products Error:", error);
    return fail("INTERNAL_ERROR", "無法獲取產品資料");
  }
}

// POST: 新增產品
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = `
      INSERT INTO products (name, company, category_id, price, discount, description, image_url, thumbnail_url, stock_amount, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`;

    // 🔥 注意：這裡將 body.category 改對應為 category_id，確保寫入資料庫不會報錯
    const result = await pool.query(query, [
      body.name,
      body.company,
      body.category_id,
      body.price,
      body.discount,
      body.description,
      body.image_url,
      body.thumbnail_url,
      body.stock_amount,
      body.is_featured,
    ]);

    return ok({
      data: { id: result.rows[0].id },
      message: "新增成功",
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return fail("INTERNAL_ERROR", "新增失敗");
  }
}

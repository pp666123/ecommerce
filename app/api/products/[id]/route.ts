import { ok, fail } from "@/lib/response";
import pool from "@/lib/db";
import { ProductUpdate } from "@/services/api";

// GET: 獲取單一商品
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string}> },
) {
  try {
    const { id } = await params;

    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      // 找不到資料時，回傳 404 狀態對應的錯誤代碼
      return fail("NOT_FOUND", "找不到該產品");
    }

    return ok({ data: result.rows[0] });
  } catch (error) {
    console.error("GET Product Error:", error);
    return fail("INTERNAL_ERROR", "伺服器錯誤");
  }
}

// DELETE: 刪除商品
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string}> },
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    return ok({ message: "刪除成功" });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return fail("INTERNAL_ERROR", "刪除失敗");
  }
}

// PUT: 更新商品
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string}> },
) {
  try {
    const { id } = await params;
    const body: ProductUpdate = await req.json();

    const query = `
      UPDATE products 
      SET name=$1, company=$2, category=$3, price=$4, discount=$5, 
          description=$6, image_url=$7, thumbnail_url=$8, 
          stock_amount=$9, is_featured=$10
      WHERE id=$11`;

    await pool.query(query, [
      body.name,
      body.company,
      body.category,
      body.price,
      body.discount,
      body.description,
      body.image_url,
      body.thumbnail_url,
      body.stock_amount,
      body.is_featured,
      id,
    ]);

    return ok({ message: "更新成功" });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return fail("INTERNAL_ERROR", "更新失敗");
  }
}

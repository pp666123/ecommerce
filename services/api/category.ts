import { fetcher } from "./fetcher";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  sub_name?: string;
  description?: string;
  created_at?: string;
}

export const categoryApi = {
  // 將 any[] 替換為 Category[]
  getAll: () =>
    fetcher<Category[]>("/api/categories", {
      method: "GET",
    }),

  // 🔥 新增：透過 slug 取得單一分類的所有欄位 (包含圖片與文案)
  getBySlug: (slug: string) =>
    fetcher<Category>(`/api/categories/${encodeURIComponent(slug)}`, {
      method: "GET",
    }),
};

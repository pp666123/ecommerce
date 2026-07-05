import { fetcher } from "./fetcher";

export interface ProductUpdate {
  name: string;
  company: string;
  category: string;
  price: number;
  discount: number;
  description: string;
  image_url: string[];
  thumbnail_url: string[];
  stock_amount: number;
  is_featured: boolean;
  is_new?: boolean;
}

export interface Product {
  id: number;
  name: string;
  company: string | null;
  category: string | null;
  price: number;
  discount: number;
  description: string | null;
  image_url: string[];
  thumbnail_url: string[];
  stock_amount: number;
  is_featured: boolean;
  created_at: Date;
  is_new?: boolean;
}

export const productApi = {
  // 🔥 新增：獲取產品列表 (支援查詢參數，例如 limit 或 featured)
  getAll: (params?: {
    limit?: number;
    featured?: boolean;
    category?: string;
  }) => {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";

    return fetcher<Product[]>(
      `/api/products${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
      },
    );
  },

  // 🔥 新增：獲取單一產品詳情
  getById: (id: number) =>
    fetcher<Product>(`/api/products/${id}`, {
      method: "GET",
    }),

  create: (data: ProductUpdate) =>
    fetcher<{ id: number }>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ProductUpdate) =>
    fetcher<{ message: string }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetcher<{ message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    }),
};

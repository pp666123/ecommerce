"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "@/services/api";

// ==========================================
// 商品相關 Hooks
// ==========================================

export const useFeaturedProduct = () =>
  useQuery({
    queryKey: ["product", "featured"],
    queryFn: async () => {
      const data = await productApi.getAll({ limit: 1, featured: true });
      // 直接回傳陣列的第一筆，前端元件用起來更乾淨
      return data?.[0] || null;
    },
    staleTime: 1000 * 60 * 5, // 快取 5 分鐘
    refetchOnWindowFocus: false,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["products", "arrivals"],
    queryFn: () => productApi.getAll({ limit: 4, featured: false }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

// 🔥 新增：通用的商品列表 Hook (支援傳入分類、數量條件)
export const useProducts = (params?: { limit?: number; featured?: boolean; category?: string }) =>
  useQuery({
    // 將 params 放入 queryKey，這樣只要篩選條件改變，React Query 就會自動重新打 API
    queryKey: ["products", "list", params],
    queryFn: () => productApi.getAll(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

// 🔥 新增：取得單一商品詳情
export const useProductById = (id: number) =>
  useQuery({
    queryKey: ["product", "detail", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id, // 關鍵防呆：確保有傳入 id 才會真正發出 API 請求
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });


// ==========================================
// 分類相關 Hooks
// ==========================================

export const useCategories = () =>
  useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoryApi.getAll(),
    staleTime: 1000 * 60 * 30, // 分類極少變動，快取設定 30 分鐘即可
    refetchOnWindowFocus: false,
  });

// 🔥 新增：透過 slug 取得單一分類 (用來抓取文案與分類主圖)
export const useCategoryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["category", "detail", slug],
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug, // 確保有 slug 才會發出請求
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
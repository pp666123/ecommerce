"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "@/services/api";

export const useFeaturedProduct = () =>
  useQuery({
    queryKey: ["featured"],
    queryFn: async () => productApi.getAll({ limit: 1, featured: true }),
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["arrivals"],
    queryFn: () => productApi.getAll({ limit: 4, featured: false }),
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
    // staleTime: 1000 * 60 * 30, // 分類很少變動，快取 30 分鐘
  });

export const useProducts = (params?: {
  limit?: number;
  featured?: boolean;
  category?: string;
}) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getAll(params),
  });

export const useCategoryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useProductById = (id: number) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id, 
  });

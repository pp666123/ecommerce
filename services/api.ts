interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result: ApiResponse<T> = await res.json();

  // 若 success 為 false，直接拋出後端定義的錯誤訊息
  if (!result.success) {
    throw new Error(result.error?.message || "發生未知錯誤");
  }

  // 斷言 data 必定存在，因為 success 為 true
  return result.data as T;
}

// ==========================================
// 定義請求 Payload 的型別
// ==========================================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// 🔥 新增：忘記密碼與重設密碼的 Payload
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface GoogleLoginPayload {
  credential: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

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

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  sub_name?: string;
  description?: string;
  created_at?: string;
}

// ==========================================
// 模組化匯出各個領域的 API
// ==========================================

export const authApi = {
  login: (data: LoginPayload) =>
    fetcher<{ message: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterPayload) =>
    fetcher<{ message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 取得當前登入使用者
  getMe: () =>
    fetcher<UserProfile>("/api/auth/me", {
      method: "GET",
    }),

  // 🔥 登出 (清除 Cookie)
  logout: () =>
    fetcher<{ message: string }>("/api/auth/logout", {
      method: "POST",
    }),

  // 🔥 新增：發送重設密碼信件
  forgotPassword: (data: ForgotPasswordPayload) =>
    fetcher<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 新增：執行重設密碼
  resetPassword: (data: ResetPasswordPayload) =>
    fetcher<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 新增：Google 第三方登入
  googleLogin: (data: GoogleLoginPayload) =>
    fetcher<{ message?: string }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

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

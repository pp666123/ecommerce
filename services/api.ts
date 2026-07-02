export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
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

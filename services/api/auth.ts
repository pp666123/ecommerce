import { fetcher } from "./fetcher";

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
  accessToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  default_carrier_code:string;
}

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
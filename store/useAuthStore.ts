import { create } from "zustand";
import { authApi, UserProfile } from "@/services/api";

interface AuthState {
  user: UserProfile | null;
  isInitialized: boolean; // 用來判斷是否已經檢查過登入狀態，可避免畫面閃爍
  setUser: (user: UserProfile | null) => void;
  checkAuth: () => Promise<void>;
  getUser: () => Promise<UserProfile | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,

  // 手動設定 user 狀態
  setUser: (user) => set({ user }),

  // 呼叫 API 檢查登入狀態，並更新全域狀態
  checkAuth: async () => {
    try {
      const userData = await authApi.getMe();
      set({ user: userData, isInitialized: true });
    } catch (error) {
      set({ user: null, isInitialized: true });
    }
  },

  getUser: async () => {
    const currentUser = get().user;
    if (currentUser) return currentUser; // 有快取直接回傳

    try {
      const userData = await authApi.getMe();
      set({ user: userData, isInitialized: true });
      return userData;
    } catch (error) {
      set({ user: null, isInitialized: true });
      return null;
    }
  },
}));

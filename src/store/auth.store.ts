import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthAcademicInfo {
  institution?: string;
  courseOfStudy?: string;
  level?: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  academicInfo?: AuthAcademicInfo;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setAuthSession: (session: {
    accessToken: string;
    user: AuthUser;
    refreshToken?: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      setAuthSession: ({ accessToken, user, refreshToken = null }) =>
        set({ accessToken, user, refreshToken }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);

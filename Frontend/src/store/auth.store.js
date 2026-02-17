import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { privateAxios } from "../config/axios.config";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const pickSafeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthReady: false,
      sessionExpiresAt: null,

      setUser: (user) =>
        set({
          user: pickSafeUser(user),
          isAuthReady: true,
          sessionExpiresAt: Date.now() + SESSION_TTL_MS,
        }),

      clearUser: () =>
        set({ user: null, isAuthReady: true, sessionExpiresAt: null }),

      initializeAuth: async () => {
        if (get().isAuthReady) return;

        const user = get().user;
        const sessionExpiresAt = get().sessionExpiresAt;
        const isSessionFresh =
          Boolean(user) &&
          Boolean(sessionExpiresAt) &&
          Date.now() < sessionExpiresAt;

        if (isSessionFresh) {
          set({ isAuthReady: true });
          return;
        }

        try {
          const response = await privateAxios.get("/auth/me");
          set({
            user: pickSafeUser(response.data?.user),
            isAuthReady: true,
            sessionExpiresAt: Date.now() + SESSION_TTL_MS,
          });
        } catch (error) {
          set({ user: null, isAuthReady: true, sessionExpiresAt: null });
        }
      },
    }),
    {
      name: "medconnect-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    }
  )
);

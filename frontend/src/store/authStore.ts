import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSize: number;
  crops: string[];
  language: 'swahili' | 'english' | 'kikuyu' | 'luo';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  language: 'swahili' | 'english' | 'kikuyu' | 'luo';
  theme: 'light' | 'dark';
  notifications: boolean;
  offlineMode: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (language: 'swahili' | 'english' | 'kikuyu' | 'luo') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotifications: (enabled: boolean) => void;
  setOfflineMode: (offline: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: true,
      isAuthenticated: false,
      token: null,
      language: 'swahili',
      theme: 'light',
      notifications: true,
      offlineMode: false,

      // Actions
      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      setLanguage: (language: 'swahili' | 'english' | 'kikuyu' | 'luo') =>
        set({ language }),

      setTheme: (theme: 'light' | 'dark') =>
        set({ theme }),

      setNotifications: (enabled: boolean) =>
        set({ notifications: enabled }),

      setOfflineMode: (offline: boolean) =>
        set({ offlineMode: offline }),
    }),
    {
      name: 'agriwise-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        theme: state.theme,
        notifications: state.notifications,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useLanguage = () => useAuthStore((state) => state.language);
export const useTheme = () => useAuthStore((state) => state.theme);
export const useOfflineMode = () => useAuthStore((state) => state.offlineMode); 
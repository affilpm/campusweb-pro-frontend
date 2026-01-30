import { create } from 'zustand';
import { AdminUser, AuthState, LoginCredentials } from '@/lib/types';
import { authApi, setAccessToken, clearAccessToken } from '@/lib/api';

interface AuthStore extends AuthState {
  setUser: (user: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

// Flag to track if initialization is currently in progress (prevents concurrent calls)
let isInitializing = false;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),

  // Login action
  login: async (credentials) => {
    try {
      set({ isLoading: true });

      const data = await authApi.login(credentials.email, credentials.password);

      if (!data.success) {
        set({ isLoading: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        return { success: false, message: data.message || 'Login failed' };
      }

      // Persist access token to localStorage
      if (typeof window !== 'undefined' && data.access) {
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
      }

      // Set user state
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, message: 'Login successful' };
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      set({ isLoading: false });
      const message = error.response?.data?.message || 'An error occurred during login';
      return { success: false, message };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authApi.logout();

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      clearAccessToken();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch {
      // Clear state even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      clearAccessToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Refresh token action - handled automatically by 401 interceptor
  refreshToken: async () => {
    return true; 
  },

  // Initialize auth state (check for existing session)
  initialize: async () => {
    const state = get();
    
    // If already authenticated with a user, don't re-initialize
    if (state.isAuthenticated && state.user) {
      set({ isLoading: false });
      return;
    }
    
    // Prevent concurrent initialization calls
    if (isInitializing) {
      return;
    }
    isInitializing = true;

    try {
      set({ isLoading: true });

      // Check for token in localStorage first
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('access_token');
      }

      if (token) {
        // Verify token by fetching user info
        try {
          const userData = await authApi.getMe();
          
          if (userData.success && userData.user) {
             set({
               user: userData.user,
               isAuthenticated: true,
               isLoading: false,
             });
             isInitializing = false;
             return;
          }
        } catch {
          // Token is invalid, remove it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      }

      // If no valid localStorage token, try refresh
      try {
        const refreshData = await authApi.refresh();

        if (refreshData.success && refreshData.access) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', refreshData.access);
          }
          setAccessToken(refreshData.access);
          
          // Get user info with the new access token
          try {
            const userData = await authApi.getMe();
            if (userData.success && userData.user) {
              set({
                user: userData.user,
                isAuthenticated: true,
                isLoading: false,
              });
              isInitializing = false;
              return;
            }
          } catch {
            // Failed to get user info
          }
        }
      } catch {
        // Refresh failed
      }

      // No valid session
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } finally {
      isInitializing = false;
    }
  },
}));

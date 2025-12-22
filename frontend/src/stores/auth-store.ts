import { create } from 'zustand';
import { AdminUser, AuthState, LoginCredentials } from '@/lib/types';
import { authApi, setAccessToken, clearAccessToken } from '@/lib/api';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

// Token refresh timer
let refreshTimer: NodeJS.Timeout | null = null;

// Flag to prevent multiple initializations
let isInitialized = false;

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

      // Schedule token refresh
      scheduleTokenRefresh(get);

      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'An error occurred during login';
      return { success: false, message };
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Clear refresh timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }

      // Call logout API
      await authApi.logout();

      // Clear token from storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      clearAccessToken();

      // Clear state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Reset initialization flag so we can reinitialize after login
      isInitialized = false;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      clearAccessToken();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      isInitialized = false;
    }
  },

  // Refresh token action
  refreshToken: async () => {
    // For now, we rely on the access token being valid long enough
    // Real refresh requires httpOnly cookie which fails cross-domain
    // When checks fail, user will just have to login again
    return true; 
  },

  // Initialize auth state (check for existing session)
  initialize: async () => {
    // Prevent multiple initializations
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    try {
      set({ isLoading: true });

      // Check for token in localStorage first (fallback for cross-domain)
      let token = null;
      if (typeof window !== 'undefined') {
        // Use 'access_token' to match api.ts
        token = localStorage.getItem('access_token');
      }

      if (token) {
        // Verify token by fetching user info
        try {
          // We don't need setAccessToken because api.ts reads from localStorage directly
          const userData = await authApi.getMe();
          if (userData.success) {
             set({
               user: userData.user,
               isAuthenticated: true,
               isLoading: false,
             });
             return;
          }
        } catch (e) {
             console.log('Stored token invalid');
             if (typeof window !== 'undefined') {
               localStorage.removeItem('access_token');
             }
        }
      }

      // If no localStorage token, try standard cookie refresh (will likely fail cross-domain)
      try {
        const refreshData = await authApi.refresh();

        if (refreshData.success && refreshData.access) {
            // api.ts helper might have already set it, but ensure consistency
            if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', refreshData.access);
            }
            // Get user info with the new access token
            try {
            const userData = await authApi.getMe();

            if (userData.success) {
                set({
                user: userData.user,
                isAuthenticated: true,
                isLoading: false,
                });

                // Schedule token refresh
                scheduleTokenRefresh(get);
                return;
            }
            } catch (meError) {
            console.error('Failed to get user info:', meError);
            }
        }
      } catch (e) {
          // Refresh failed, user is not logged in
      }

      // No valid session - this is expected for new visitors
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

// Schedule token refresh before expiry
function scheduleTokenRefresh(get: () => AuthStore) {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  // Refresh 1 minute before the access token expires (14 minutes)
  const refreshInterval = 14 * 60 * 1000; // 14 minutes

  refreshTimer = setTimeout(async () => {
    const store = get();
    if (store.isAuthenticated) {
      await store.refreshToken();
    }
  }, refreshInterval);
}

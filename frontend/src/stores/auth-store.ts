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
      console.log('[Auth] Login attempt for:', credentials.email);

      const data = await authApi.login(credentials.email, credentials.password);
      console.log('[Auth] Login response:', { success: data.success, hasAccess: !!data.access, hasUser: !!data.user });

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
        console.log('[Auth] Token saved to localStorage');
      }

      // Set user state
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('[Auth] State updated - user authenticated:', data.user?.email);

      // Schedule token refresh
      scheduleTokenRefresh(get);

      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
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
        console.log('[Auth] Initialize - token in localStorage:', token ? 'present' : 'none');
      }

      if (token) {
        // Verify token by fetching user info
        try {
          console.log('[Auth] Verifying token with /me/ endpoint...');
          const userData = await authApi.getMe();
          console.log('[Auth] /me/ response:', userData);
          
          if (userData.success && userData.user) {
             set({
               user: userData.user,
               isAuthenticated: true,
               isLoading: false,
             });
             console.log('[Auth] User authenticated:', userData.user.email);
             isInitializing = false;
             return;
          }
        } catch (e: any) {
          console.log('[Auth] Token verification failed:', e?.response?.status || e.message);
          // Token is invalid, remove it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
          }
        }
      }

      // If no valid localStorage token, try cookie refresh
      // Note: This may fail in cross-origin setups where cookie isn't available
      try {
        console.log('[Auth] Attempting cookie refresh...');
        const refreshData = await authApi.refresh();

        if (refreshData.success && refreshData.access) {
          console.log('[Auth] Refresh successful, new token received');
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', refreshData.access);
          }
          
          // Get user info with the new access token
          try {
            const userData = await authApi.getMe();
            if (userData.success && userData.user) {
              set({
                user: userData.user,
                isAuthenticated: true,
                isLoading: false,
              });
              scheduleTokenRefresh(get);
              isInitializing = false;
              return;
            }
          } catch (meError) {
            console.error('[Auth] Failed to get user info after refresh:', meError);
          }
        }
      } catch (e) {
        console.log('[Auth] Cookie refresh failed (expected for cross-origin)');
      }

      // No valid session
      console.log('[Auth] No valid session found');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('[Auth] Initialization error:', error);
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

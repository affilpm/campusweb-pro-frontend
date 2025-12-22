/**
 * Axios API Client for Django Backend
 * Handles authentication, token refresh, and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 1. Setup Axios to support Cookies (Credential mode)
const client = axios.create({
  baseURL: API_URL, // Use environment variable
  withCredentials: true, // IMPORTANT: Sends HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 2. Helper to queue requests while refreshing
const subscribeToRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 3. Request Interceptor: Attach Access Token
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 4. Response Interceptor: Auto-Refresh on 401
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';
      
      // Avoid infinite loop on login/refresh endpoints
      if (
        url.includes('/login/') || 
        url.includes('/refresh/') || 
        url.includes('/verify/') 
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // If already refreshing, wait for new token
        return new Promise((resolve) => {
          subscribeToRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Call backend to refresh (Cookie is sent automatically)
        const { data } = await client.post('/api/admin/auth/refresh/');
        
        // Save new Access Token
        const newToken = data.access;
        localStorage.setItem('access_token', newToken);
        
        // Notify pending requests
        onRefreshed(newToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return client(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed (Session expired) -> Logout user
        localStorage.removeItem('access_token');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/secure-admin/login'; // Redirect to login
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;

export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const clearAccessToken = () => {
    localStorage.removeItem('access_token');
};

export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
}

// 5. API Methods
// Exporting as authApi to match existing imports in the codebase
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await client.post('/api/admin/auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      // Shim: return success flag for compatibility
      return { success: true, ...response.data };
    }
    return response.data;
  },

  logout: async () => {
    try {
        await client.post('/api/admin/auth/logout/'); // Clears cookie on server
    } catch (e) {
        // Ignore logout errors
    }
    localStorage.removeItem('access_token');
  },

  verify: async () => {
    const response = await client.post('/api/admin/auth/verify/');
    return { success: true, ...response.data };
  },

  refresh: async () => {
      // Wrapper to manually trigger refresh if needed
      const response = await client.post('/api/admin/auth/refresh/');
      if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          return { success: true, ...response.data };
      }
      return response.data;
  },

  getMe: async () => {
    // Check if we have a token first to rely on interceptor
    const response = await client.post('/api/admin/auth/me/');
    // Shim for compatibility
    const data = response.data;
    // If data has 'user' property, use it, otherwise assume data is the user
    return { 
        success: true, 
        user: data.user || data,
        ...data 
    };
  },
  
  // Generic axios instance for other parts of the app
  client 
};

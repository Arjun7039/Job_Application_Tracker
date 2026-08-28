import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * When VITE_API_URL is not configured or backend is unreachable in demo mode,
 * the UI runs in browser demo mode persisting in localStorage.
 */
export const DEMO_MODE = !API_URL;

export const TOKEN_KEY = "jobtrack_token";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export function apiError(error, fallback = "Something went wrong") {
  return error?.response?.data?.detail || error?.message || fallback;
}

export default api;

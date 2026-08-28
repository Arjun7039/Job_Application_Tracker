import axios from "axios";

const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000").trim();
export const API_URL = rawUrl.replace(/\/+$/, "");

/**
 * When VITE_API_URL is not configured and not on localhost,
 * the UI falls back to browser demo mode persisting in localStorage.
 */
export const DEMO_MODE = !import.meta.env.VITE_API_URL && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

export const TOKEN_KEY = "jobtrack_token";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.baseURL) {
    config.baseURL = config.baseURL.replace(/\/+$/, "");
  }
  if (config.url) {
    config.url = config.url.replace(/^\/+/g, "");
  }
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

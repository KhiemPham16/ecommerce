// axios instance + interceptors
import axios from "axios";
import { useAuthStore } from "./stores/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const original = err.config;

    if (status !== 401 || original._retry) throw err;
    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = api.post("/auth/refresh").finally(() => (refreshPromise = null));
    }

    const refreshRes = await refreshPromise;
    const newToken = refreshRes.data.accessToken;
    useAuthStore.getState().setAccessToken(newToken);

    original.headers.Authorization = `Bearer ${newToken}`;
    return api.request(original);
  }
);
import axios from 'axios';
import { useAuthStore } from '~/stores/useAuthStore';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api/v1',
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let refreshPromise = null;

const publicAuthRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/verify-email',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/',
    '/products',
    '/products/:id',
    'contacts'
];

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const status = err.response?.status;
        const original = err.config;

        if (!original) {
            throw err;
        }

        const isPublicAuthRoute = publicAuthRoutes.some((route) => original.url?.includes(route));

        if (isPublicAuthRoute) {
            throw err;
        }

        if (status !== 401 || original._retry) {
            throw err;
        }

        original._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axiosInstance.post('/auth/refresh').finally(() => {
                    refreshPromise = null;
                });
            }

            const refreshRes = await refreshPromise;

            const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;

            if (!newToken) {
                useAuthStore.getState().clearState();
                throw err;
            }

            useAuthStore.getState().setAccessToken(newToken);

            original.headers.Authorization = `Bearer ${newToken}`;

            return axiosInstance.request(original);
        } catch (refreshError) {
            useAuthStore.getState().clearState();
            throw refreshError;
        }
    }
);

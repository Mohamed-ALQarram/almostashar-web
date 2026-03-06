import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const api = axios.create({
    baseURL: 'https://almostashar.runasp.net',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// ─── Request Interceptor ────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────
api.interceptors.response.use(
    (response) => {
        const data = response.data;

        // The API wraps everything in { isSuccess, value?, error? }
        // On success, unwrap directly so consumers get the value
        if (data?.isSuccess) {
            return data.value;
        }

        // If the API returned isSuccess: false inside a 200,
        // treat it as an error
        if (data && data.isSuccess === false) {
            return Promise.reject(data.error);
        }

        return data;
    },
    (error) => {
        // Server returned an error status (4xx, 5xx)
        const serverError = error.response?.data?.error;

        if (serverError) {
            // Reject with the normalized server error shape:
            // { code, message, details? }
            window.location.href = '/server-error';
            return Promise.reject(serverError);
        }

        // Network / timeout errors
        window.location.href = '/network-error';
        return Promise.reject({
            code: 'Network.Error',
            message: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.',
        });
    }
);

export default api;

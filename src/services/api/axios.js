import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const api = axios.create({
    baseURL: 'https://almostashar.runasp.net',
    // baseURL: 'https://localhost:7151',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 50000,
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

// ─── Refresh-token queue ────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

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
    async (error) => {
        const originalRequest = error.config;

        // ── 401 → attempt silent refresh ────────────────────────
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Mark to prevent infinite loops
            originalRequest._retry = true;

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            isRefreshing = true;

            const { refreshToken } = useAuthStore.getState();

            try {
                // Call refresh endpoint directly via axios to avoid interceptor loops
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/api/auth/refresh`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (!data?.isSuccess) {
                    throw new Error(data?.error?.message || 'Refresh failed');
                }

                const { user, tokens } = data.value;

                // Persist new credentials
                useAuthStore.getState().setAuth({ user, tokens });

                // Replay queued requests with the new token
                processQueue(null, tokens.accessToken);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed → clear session & redirect
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                window.location.href = '/guest';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ── Other error statuses ────────────────────────────────
        const serverError = error.response?.data?.error;

        if (serverError) {
            // Reject with the normalized server error shape:
            // { code, message, details? }
            return Promise.reject(serverError);
        }

        // Network / timeout errors
        // window.location.href = '/network-error';
        return Promise.reject({
            code: 'Network.Error',
            message: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.',
        });
    }
);

export default api;

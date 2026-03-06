import api from '../../../services/api/axios';

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user, tokens }>} — unwrapped by Axios interceptor
 */
export const loginApi = (credentials) => api.post('/api/auth/login', credentials);

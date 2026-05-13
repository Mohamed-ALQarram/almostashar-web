import api from '../../../services/api/axios';

// ─── Analytics ──────────────────────────────────────────────────────
/**
 * GET /api/Lawyers/home/analytics
 * Fetch stats: ratings, requests count, earnings, open/completed cases.
 */
export const getAnalytics = () => api.get('/api/lawyer/home/analytics');

// ─── Incoming Direct Requests ───────────────────────────────────────
/**
 * GET /api/LawyerRequests/direct/incoming
 * @param {{ status?: string, serviceType?: string }} params
 */
export const getIncomingRequests = (params = {}) =>
    api.get('/api/lawyer/requests/direct/incoming', { params });

// ─── Active Cases ───────────────────────────────────────────────────
/**
 * GET /api/LawyerHome/active-cases
 * @param {number} limit — default 5
 */
export const getActiveCases = (limit = 5) =>
    api.get('/api/lawyer/home/active-cases', { params: { limit } });

// ─── Notifications ──────────────────────────────────────────────────
/**
 * GET /api/Notifications
 * @param {{ isRead?: boolean, cursor?: number, pageSize?: number }} params
 */
export const getNotifications = (params = {}) =>
    api.get('/api/Notifications', { params });

// ─── Mark Notifications as Read ─────────────────────────────────────
/**
 * PUT /api/Notifications/mark-as-read
 * @param {number|undefined} lastReadId
 */
export const markNotificationsAsRead = (lastReadId) =>
    api.put('/api/Notifications/mark-as-read', null, {
        params: lastReadId ? { lastReadId } : {},
    });

// ─── Chats ──────────────────────────────────────────────────────────
/**
 * GET /api/Chats
 * @param {{ Search?: string, NextCursor?: number, CursorDate?: string, PageSize?: number }} params
 */
export const getChats = (params = {}) =>
    api.get('/api/Chats', { params });

// ─── Chat Messages ──────────────────────────────────────────────────
/**
 * GET /api/Chats/Messages
 * @param {{ ChatId: number, PageSize?: number, NextCursor?: number }} params
 */
export const getChatMessages = (params) =>
    api.get('/api/Chats/Messages', { params });

// ─── Mark Messages as Read ──────────────────────────────────────────
/**
 * PUT /api/Chats/{chatId}/messages/{lastReadMessageId}/mark-read
 * Marks all messages up to lastReadMessageId as read.
 */
export const markMessagesAsRead = (chatId, lastReadMessageId) =>
    api.put(`/api/Chats/${chatId}/messages/${lastReadMessageId}/mark-read`);

// ─── Presigned URL ──────────────────────────────────────────────────
/**
 * POST /api/documents/presigned-url
 * Resolves a storage file path to a temporary downloadable URL.
 * @param {string} filePath
 * @param {number} expirationMinutes — default 1440 (24h)
 */
export const getPresignedUrl = (filePath, expirationMinutes = 1440) =>
    api.post('/api/documents/presigned-url', { filePath, expirationMinutes });

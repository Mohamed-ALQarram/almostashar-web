import api from '../../../services/api/axios';

// ─── Analytics ──────────────────────────────────────────────────────
/**
 * GET /api/Lawyers/home/analytics
 * Fetch stats: ratings, requests count, earnings, open/completed cases.
 */
export const getAnalytics = () => api.get('/api/lawyers/home/analytics');

// ─── Incoming Direct Requests ───────────────────────────────────────
/**
 * GET /api/LawyerRequests/direct/incoming
 * @param {{ status?: string, serviceType?: string }} params
 */
export const getIncomingRequests = (params = {}) =>
    api.get('/api/lawyer/requests/direct/incoming', {
        params: { status: 0, ...params }
    });

/**
 * PUT /api/lawyer/requests/{id}/accept
 * Accept a direct request
 */
export const acceptDirectRequest = (id) =>
    api.put(`/api/lawyer/requests/${id}/accept`);

/**
 * PUT /api/lawyer/requests/{id}/reject
 * Reject a direct request
 */
export const rejectDirectRequest = (id) =>
    api.put(`/api/lawyer/requests/${id}/reject`);

// ─── Broadcast Requests ─────────────────────────────────────────────
/**
 * GET /api/lawyer/requests/broadcast/available
 * Fetch available broadcast requests
 */
export const getAvailableBroadcastRequests = (params = {}) =>
    api.get('/api/lawyer/requests/broadcast/available', { params });

/**
 * POST /api/lawyer/requests/{id}/offers
 * Send an offer to a broadcast request
 */
export const sendOffer = (id, data) =>
    api.post(`/api/lawyer/requests/${id}/offers`, data);

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

// ─── Lawyer Services ────────────────────────────────────────────────
/**
 * GET /api/LawyerService
 * Fetch the services the lawyer has previously added
 */
export const getLawyerServices = () =>
    api.get('/api/lawyer-services');

/**
 * POST /api/LawyerService
 * Add a new service to the lawyer's services list
 */
export const addLawyerService = (data) =>
    api.post('/api/lawyer-services', data);

/**
 * PUT /api/LawyerService/{serviceId}
 * Update price, duration, or active status
 */
export const updateLawyerService = (serviceId, data) =>
    api.put(`/api/lawyer-services/${serviceId}`, data);

// ─── Legal Services Catalog ─────────────────────────────────────────
/**
 * GET /api/LegalServices
 * Get general catalog to populate dropdowns
 */
export const getLegalServicesCatalog = () =>
    api.get('/api/legal-services');

// ─── Lawyer Cases ───────────────────────────────────────────────────
/**
 * GET /api/cases
 * Fetch lawyer cases with cursor-based pagination.
 * @param {{ status?: string, cursor?: number|string, pageSize?: number }} params
 */
export const getCases = (params = {}) =>
    api.get('/api/cases', { params });

/**
 * GET /api/cases/:caseId
 * Fetch full details for a single case.
 */
export const getCaseDetails = (caseId) =>
    api.get(`/api/cases/${caseId}`);

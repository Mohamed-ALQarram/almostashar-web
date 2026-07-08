import api from '../../../services/api/axios';

// ─── Wallet Balance ─────────────────────────────────────────────────
/**
 * GET /api/lawyer/wallet
 * Fetch wallet balance summary (available, escrow, earnings, etc.)
 */
export const getWallet = () => api.get('/api/lawyer/wallet');

// ─── Wallet Transactions ────────────────────────────────────────────
/**
 * GET /api/lawyer/wallet/transactions
 * @param {{ cursor?: number, pageSize?: number }} params
 * First request should NOT include cursor; use nextCursor from response for subsequent pages.
 */
export const getWalletTransactions = (params = {}) => {
    const cleanParams = { ...params };
    if (cleanParams.cursor === undefined || cleanParams.cursor === null) {
        delete cleanParams.cursor;
    }
    return api.get('/api/lawyer/wallet/transactions', { params: cleanParams });
};

// ─── Withdrawal Requests ────────────────────────────────────────────
/**
 * GET /api/lawyer/wallet/withdrawals
 * @param {{ cursor?: number, pageSize?: number }} params
 * First request should NOT include cursor; use nextCursor from response for subsequent pages.
 */
export const getWithdrawalRequests = (params = {}) => {
    const cleanParams = { ...params };
    if (cleanParams.cursor === undefined || cleanParams.cursor === null) {
        delete cleanParams.cursor;
    }
    return api.get('/api/lawyer/wallet/withdrawals', { params: cleanParams });
};

// ─── Create Withdrawal Request ──────────────────────────────────────
/**
 * POST /api/lawyer/wallet/withdrawals
 * @param {{ amount: number, method: string, accountDetails: string }} data
 * method: BankTransfer | VodafoneCash | InstaPay | Other
 */
export const createWithdrawalRequest = (data) =>
    api.post('/api/lawyer/wallet/withdrawals', data);

// ─── Cancel Withdrawal Request ──────────────────────────────────────
/**
 * POST /api/lawyer/wallet/withdrawals/:id/cancel
 * @param {number} id — withdrawal request ID
 */
export const cancelWithdrawalRequest = (id) =>
    api.post(`/api/lawyer/wallet/withdrawals/${id}/cancel`);

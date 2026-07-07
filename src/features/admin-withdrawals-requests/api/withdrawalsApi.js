import api from "../../../services/api/axios";

export const getWithdrawalsList = async ({ status, cursor, pageSize = 20 }) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') {
        // Map Arabic status labels to backend enums if necessary, but we'll use enum values in the component
        params.append('status', status);
    }
    if (cursor) params.append('cursor', cursor);
    if (pageSize) params.append('pageSize', pageSize);

    const response = await api.get(`/api/admin/withdrawals?${params.toString()}`);
    return response;
};

export const getWithdrawalDetails = async (id) =>
    await api.get(`/api/admin/withdrawals/${id}`);

export const rejectWithdrawal = async (id, data) =>
    await api.post(`/api/admin/withdrawals/${id}/reject`, data);

export const approveWithdrawal = async (id, data) =>
    await api.post(`/api/admin/withdrawals/${id}/approve`, data);

export const markWithdrawalPaid = async (id, data) =>
    await api.post(`/api/admin/withdrawals/${id}/mark-paid`, data);

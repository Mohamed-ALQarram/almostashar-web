import api from '../../../services/api/axios';

// ─── Get single dispute details ────────────────────────────────────
export const getDisputeDetail = (disputeId) =>
    api.get(`/api/admin/disputes/${disputeId}`);

// ─── Admin actions on a dispute ────────────────────────────────────

/** Resolve the dispute (ReleaseToLawyer, RefundToClient, Dismiss) */
export const resolveDispute = (disputeId, payload) =>
    api.post(`/api/admin/disputes/${disputeId}/resolve`, payload);

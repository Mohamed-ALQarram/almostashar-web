import api from '../../../services/api/axios';

// ─── Get all unverified lawyers ────────────────────────────────────
export const getUnverifiedLawyers = () =>
    api.get('/api/admin/lawyers/unverified');

// ─── Verify (approve) a lawyer ─────────────────────────────────────
export const verifyLawyer = (lawyerId, IsAccepted) =>
    api.put('/api/admin/lawyers/verify', { lawyerId, IsAccepted });


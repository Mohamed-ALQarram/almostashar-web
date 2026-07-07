import api from '../../../services/api/axios';

// ─── Get disputes (with optional filters) ──────────────────────────
export const getDisputes = ({ status, pageSize = 20, cursor, cursorDate } = {}) =>
    api.get('/api/admin/disputes', {
        params: {
            ...(status && { Status: status }),
            ...(pageSize && { PageSize: pageSize }),
            ...(cursor && { Cursor: cursor }),
            ...(cursorDate && { CursorDate: cursorDate }),
        },
    });

import api from '../../../services/api/axios';

/**
 * GET /api/Lawyers/:lawyerId/profile
 * Fetch lawyer profile data
 */
export const getLawyerProfile = (lawyerId) => api.get(`/api/Lawyers/${lawyerId}/profile`);

/**
 * GET /api/Lawyers/specializations
 * Fetch all specializations for dropdowns
 */
export const getSpecializations = () => api.get('/api/Lawyers/specializations');

/**
 * PUT /api/Lawyers/edit-profile
 * Update lawyer profile
 * @param {FormData} data - Profile form data
 */
export const editProfile = (data) => api.put('/api/Lawyers/edit-profile', data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

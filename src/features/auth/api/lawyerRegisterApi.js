import api from '../../../services/api/axios';

/**
 * POST /api/auth/upload-identity-documents
 * Uploads SSN, SyndicateCard, and PracticeCertificates as multipart form data.
 * @param {{ SSN: File, SyndicateCard: File, PracticeCertificates: File }} files
 * @returns {Promise<{ ssN_Url, syndicateCardUrl, practiceCertificatesUrl }>}
 */
export const uploadIdentityDocuments = (files) => {
    const formData = new FormData();
    formData.append('SSN', files.SSN);
    formData.append('SyndicateCard', files.SyndicateCard);
    formData.append('PracticeCertificates', files.PracticeCertificates);

    return api.post('/api/auth/upload-identity-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

/**
 * POST /api/auth/register/lawyer
 * @param {Object} payload — full registration body
 * @returns {Promise<{ userId, role, accountStatus, expectedReviewDays }>}
 */
export const registerLawyer = (payload) =>
    api.post('/api/auth/register/lawyer', payload);

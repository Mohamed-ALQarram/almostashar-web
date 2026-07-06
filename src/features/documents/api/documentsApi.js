import api from '../../../services/api/axios';

/**
 * Request a presigned URL to view a secure document.
 * POST /api/documents/presigned-url
 * @param {number} documentId - the document id to access the document presigned url
 * @returns {Promise<{ url: string, expirationMinutes: number }>}
 */
export const getPresignedUrl = (documentId, expirationMinutes = 60) =>
    api.post('/api/documents/presigned-url', {
        documentId,
        expirationMinutes,
    });

export const UploadDocument = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/api/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

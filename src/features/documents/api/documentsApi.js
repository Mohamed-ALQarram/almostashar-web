import api from '../../../services/api/axios';

/**
 * Request a presigned URL to view a secure document.
 * POST /api/documents/presigned-url
 * @param {string} filePath - the S3 path returned in the lawyer object
 * @returns {Promise<{ url: string, expirationMinutes: number }>}
 */
export const getPresignedUrl = (filePath) =>
    api.post('/api/documents/presigned-url', {
        filePath,
        expirationMinutes: 60,
    });

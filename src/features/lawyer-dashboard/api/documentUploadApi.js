import api from '../../../services/api/axios';

/**
 * Uploads a file for chat messages.
 *
 * POST /api/documents/upload  (multipart/form-data)
 *
 * The axios response interceptor already unwraps { isSuccess, value } → value,
 * so the resolved result is: { fileUrl: "documents/..." }
 *
 * @param {File} file
 * @returns {Promise<string>} fileUrl path
 */
export const uploadChatDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Remove the default Content-Type ('application/json' from the axios instance)
    // so that the browser/axios sets multipart/form-data with the correct boundary
    const result = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': undefined },
    });

    if (!result?.fileUrl) {
        throw new Error('فشل رفع الملف — لم يتم الحصول على رابط');
    }

    return result.fileUrl;
};

/**
 * Uploads encrypted file bytes for E2EE documents.
 *
 * @param {Blob} encryptedBlob
 * @returns {Promise<string>} fileUrl path
 */
export const uploadEncryptedDocumentBytes = async (encryptedBlob) => {
    const formData = new FormData();
    formData.append('File', encryptedBlob, 'encrypted.bin');

    const result = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': undefined },
    });

    if (!result?.fileUrl) {
        throw new Error('Encrypted file upload failed.');
    }

    return result.fileUrl;
};

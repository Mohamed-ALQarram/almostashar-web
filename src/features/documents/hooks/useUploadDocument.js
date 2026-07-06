import { useMutation } from '@tanstack/react-query';
import { UploadDocument } from '../api/documentsApi';


/**
 * @param {File} file - The file to upload
 * @returns {Promise<{documentId: number, documentName: string, type: string, sizeInBytes: number, createdAt: string}>}
 * Custom hook to upload a document.
 * Usage:
 *   const { mutate: uploadDocument, isLoading } = useUploadDocument();
 *   uploadDocument(file);
 */
const useUploadDocument = () => {
    return useMutation({
        mutationFn: (file) => UploadDocument(file),
    });
};

export default useUploadDocument; 

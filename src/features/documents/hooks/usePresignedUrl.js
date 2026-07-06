import { useQuery } from '@tanstack/react-query';
import { getPresignedUrl } from '../api/documentsApi';

/**
 * Custom hook to fetch a presigned URL for a given file path.
 * The query is only enabled if the filePath is defined.
 *
 * Usage:
 *   const { data, isLoading, isError } = usePresignedUrl(lawyer.ssN_Url);
 * @returns { documentId: number, documentName: string, url: string, type: string, sizeInBytes: number, expirationMinutes: number, expiresAt: string }}<PresignedUrl>
 */
const usePresignedUrl = (documentId, expirationMinutes = 60) => {
    return useQuery({
        queryKey: ['presigned-url', documentId],
        queryFn: () => getPresignedUrl(documentId, expirationMinutes),
        enabled: !!documentId,
        staleTime: 1000 * expirationMinutes * 30, // 30 times the expiration time
        gcTime: 1000 * expirationMinutes * 30, // 30 times the expiration time
    });
};
export default usePresignedUrl; 

import { useQuery } from '@tanstack/react-query';
import { getPresignedUrl } from '../api/documentsApi';

/**
 * Custom hook to fetch a presigned URL for a given file path.
 * The query is only enabled if the filePath is defined.
 *
 * Usage:
 *   const { data, isLoading, isError } = usePresignedUrl(lawyer.ssN_Url);
 *   // data will be { url, expirationMinutes } (auto-unwrapped by axios interceptor)
 */
export const usePresignedUrl = (filePath) => {
    return useQuery({
        // Include the filePath in the query key so it refetches when the path changes
        queryKey: ['presignedUrl', filePath],
        queryFn: () => getPresignedUrl(filePath),
        enabled: !!filePath && filePath !== 'string', // 'string' is swagger default fallback, we ignore it
        staleTime: 1000 * 60 * 15, // URLs expire, but should be good to cache for ~15 mins
    });
};

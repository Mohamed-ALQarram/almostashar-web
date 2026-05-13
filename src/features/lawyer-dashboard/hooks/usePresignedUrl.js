import { useQuery } from '@tanstack/react-query';
import { getPresignedUrl } from '../api/lawyerDashboardApi';

/**
 * Resolves a storage file path to a presigned (downloadable) URL.
 *
 * - Cached for 23 hours (URLs expire at 24h by default).
 * - Disabled when filePath is falsy → returns { url: null }.
 *
 * Usage:
 *   const { url, isLoading } = usePresignedUrl(message.documentUrl);
 *   <img src={url} />
 */
const usePresignedUrl = (filePath) => {
    const { data, isLoading } = useQuery({
        queryKey: ['presignedUrl', filePath],
        queryFn: async () => {
            const result = await getPresignedUrl(filePath);
            // result is already unwrapped by axios interceptor → { url, expirationMinutes }
            return result?.url || result;
        },
        enabled: !!filePath,
        staleTime: 1000 * 60 * 60 * 23, // 23 hours — URLs valid for 24h
        gcTime: 1000 * 60 * 60 * 24,    // keep in cache for 24h
    });

    return { url: data || null, isLoading };
};

export default usePresignedUrl;

import { useInfiniteQuery } from '@tanstack/react-query';
import { getDisputes } from '../api/adminDisputesApi';

// ─── Fetch disputes with cursor-based pagination ───────────────────
export const useAdminDisputes = ({ status, searchId } = {}) => {
    return useInfiniteQuery({
        queryKey: ['adminDisputes', status, searchId],
        queryFn: ({ pageParam }) =>
            getDisputes({
                status,
                cursor: pageParam?.cursor,
                cursorDate: pageParam?.cursorDate,
            }),
        getNextPageParam: (lastPage) => {
            if (!lastPage?.hasMore) return undefined;
            return {
                cursor: lastPage.nextCursor,
                cursorDate: lastPage.nextCursorDate,
            };
        },
        initialPageParam: undefined,
        staleTime: 1 * 60 * 1000, // 1 minutes
        refetchOnWindowFocus: false,
    });
};

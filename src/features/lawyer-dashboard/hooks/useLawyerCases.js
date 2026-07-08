import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as lawyerApi from '../api/lawyerDashboardApi';

/**
 * Fetches all lawyer cases with cursor-based infinite pagination.
 * Filtering by status is done client-side.
 * @param {number} pageSize — number of items per page
 */
export const useLawyerCases = (pageSize = 10) => {
    return useInfiniteQuery({
        queryKey: ['lawyerCases'],
        queryFn: ({ pageParam }) =>
            lawyerApi.getCases({
                cursor: pageParam || '',
                pageSize,
            }),
        initialPageParam: '',
        getNextPageParam: (lastPage) =>
            lastPage?.hasMore ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 2, // 2 min
    });
};

/**
 * Fetches full details for a single case.
 * @param {number|null} caseId
 */
export const useCaseDetails = (caseId) => {
    return useQuery({
        queryKey: ['caseDetails', caseId],
        queryFn: () => lawyerApi.getCaseDetails(caseId),
        enabled: !!caseId,
        staleTime: 1000 * 60 * 2,
    });
};


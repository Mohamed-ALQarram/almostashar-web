import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../../../services/api/axios';

/**
 * Fetches lawyers with cursor-based pagination.
 * GET /api/Lawyers?ServiceId=&Cursor=&PageSize=&Search=
 * All query params are nullable.
 */
export const useLawyers = ({ serviceId, search, pageSize = 10 } = {}) => {
    return useInfiniteQuery({
        queryKey: ['publicLawyers', { serviceId, search, pageSize }],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            if (serviceId) params.append('ServiceId', serviceId);
            if (pageParam) params.append('Cursor', pageParam);
            if (pageSize) params.append('PageSize', pageSize);
            if (search?.trim()) params.append('Search', search.trim());

            const qs = params.toString();
            const res = await api.get(`/api/Lawyers${qs ? `?${qs}` : ''}`);
            // Handle { value: { items, nextCursor, hasMore } } or direct shape
            return res?.value || res?.data?.value || res?.data || res;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.hasMore) return undefined;
            return lastPage.nextCursor ?? undefined;
        },
        initialPageParam: null,
        staleTime: 1000 * 60 * 5, // 5 min
    });
};

/**
 * Fetches first page of lawyers (for the landing section preview).
 */
export const useFeaturedLawyers = (pageSize = 10) => {
    return useQuery({
        queryKey: ['featuredLawyers', pageSize],
        queryFn: async () => {
            const res = await api.get(`/api/Lawyers?PageSize=${pageSize}`);
            const data = res?.value || res?.data?.value || res?.data || res;
            return data?.items || [];
        },
        staleTime: 1000 * 60 * 10, // 10 min
    });
};

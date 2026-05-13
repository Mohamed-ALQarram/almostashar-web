import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lawyerApi from '../api/lawyerDashboardApi';

// ─── Incoming Requests List ─────────────────────────────────────────
export const useIncomingRequestsList = (params = {}) => {
    return useQuery({
        // Include params in queryKey to differentiate filters like status
        queryKey: ['incomingRequestsList', params],
        queryFn: () => lawyerApi.getIncomingRequests(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
        select: (data) => Array.isArray(data) ? data : (data?.data || [])
    });
};

// ─── Accept Direct Request ──────────────────────────────────────────
export const useAcceptRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lawyerApi.acceptDirectRequest,
        onSuccess: () => {
            // Invalidate the requests list and analytics (since request count changed)
            queryClient.invalidateQueries({ queryKey: ['incomingRequestsList'] });
            queryClient.invalidateQueries({ queryKey: ['incomingRequests'] }); // existing dashboard widget
            queryClient.invalidateQueries({ queryKey: ['lawyerAnalytics'] });
        },
    });
};

// ─── Reject Direct Request ──────────────────────────────────────────
export const useRejectRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lawyerApi.rejectDirectRequest,
        onSuccess: () => {
            // Invalidate the requests list
            queryClient.invalidateQueries({ queryKey: ['incomingRequestsList'] });
            queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
        },
    });
};

// ─── Broadcast Requests List ────────────────────────────────────────
export const useAvailableBroadcastRequests = (params = {}) => {
    return useQuery({
        queryKey: ['availableBroadcastRequests', params],
        queryFn: () => lawyerApi.getAvailableBroadcastRequests(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
        // API returns { items: [...], hasMore: boolean, nextCursor: number }
        select: (data) => data?.items ? data : { items: Array.isArray(data) ? data : [], hasMore: false }
    });
};

// ─── Send Offer to Broadcast Request ────────────────────────────────
export const useSendOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => lawyerApi.sendOffer(id, data),
        onSuccess: () => {
            // Invalidate the broadcast requests list to remove/update the tendered request
            queryClient.invalidateQueries({ queryKey: ['availableBroadcastRequests'] });
            // Also invalidate general stats if needed
            queryClient.invalidateQueries({ queryKey: ['lawyerAnalytics'] });
        },
    });
};

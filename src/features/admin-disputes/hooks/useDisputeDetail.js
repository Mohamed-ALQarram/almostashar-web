import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getDisputeDetail,
    resolveDispute,
} from '../api/adminDisputeDetailApi';

// ─── Fetch dispute detail ──────────────────────────────────────────
export const useDisputeDetail = (disputeId) => {
    return useQuery({
        queryKey: ['disputeDetail', disputeId],
        queryFn: () => getDisputeDetail(disputeId),
        enabled: !!disputeId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};



// ─── Resolve dispute ─────────────────────────────────────────────────
export const useResolveDispute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ disputeId, payload }) => resolveDispute(disputeId, payload),
        onSuccess: (_data, { disputeId }) => {
            queryClient.invalidateQueries({ queryKey: ['disputeDetail', disputeId] });
            queryClient.invalidateQueries({ queryKey: ['adminDisputes'] });
        },
    });
};

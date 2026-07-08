import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletApi from '../api/lawyerWalletApi';

// ─── Wallet Balance ─────────────────────────────────────────────────
export const useWallet = () => {
    return useQuery({
        queryKey: ['lawyerWallet'],
        queryFn: walletApi.getWallet,
        staleTime: 1000 * 60 * 2, // 2 min
    });
};

// ─── Wallet Transactions (Infinite / Cursor Pagination) ─────────────
export const useWalletTransactions = (pageSize = 20) => {
    return useInfiniteQuery({
        queryKey: ['walletTransactions', pageSize],
        queryFn: ({ pageParam }) =>
            walletApi.getWalletTransactions({
                cursor: pageParam ?? undefined,
                pageSize,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) =>
            lastPage?.hasMore ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 3, // 3 min
    });
};

// ─── Withdrawal Requests (Infinite / Cursor Pagination) ─────────────
export const useWithdrawalRequests = (pageSize = 20) => {
    return useInfiniteQuery({
        queryKey: ['withdrawalRequests', pageSize],
        queryFn: ({ pageParam }) =>
            walletApi.getWithdrawalRequests({
                cursor: pageParam ?? undefined,
                pageSize,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) =>
            lastPage?.hasMore ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 3, // 3 min
    });
};

// ─── Create Withdrawal Request ──────────────────────────────────────
export const useCreateWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: walletApi.createWithdrawalRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawyerWallet'] });
            queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
            queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
        },
    });
};

// ─── Cancel Withdrawal Request ──────────────────────────────────────
export const useCancelWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => walletApi.cancelWithdrawalRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawyerWallet'] });
            queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
            queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
        },
    });
};

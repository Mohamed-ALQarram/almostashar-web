import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnverifiedLawyers, verifyLawyer } from '../api/adminVerificationApi';

// ─── Fetch unverified lawyers ──────────────────────────────────────
export const useUnverifiedLawyers = () => {
    return useQuery({
        queryKey: ['unverifiedLawyers'],
        queryFn: getUnverifiedLawyers,
    });
};

// ─── Verify (approve) a lawyer ─────────────────────────────────────
export const useVerifyLawyer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lawyerId, isAccepted }) => verifyLawyer(lawyerId, isAccepted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unverifiedLawyers'] });
        },
    });
};


// ─── Stats (static until a stats endpoint is available) ────────────
export const useVerificationStats = () => {
    return useQuery({
        queryKey: ['adminVerificationStats'],
        queryFn: async () => ({
            pendingReview: { value: null, label: 'في انتظار المراجعة' },
            approvedThisMonth: { value: 24, label: 'تمت الموافقة هذا الشهر' },
            rejectedThisMonth: { value: 3, label: 'تم الرفض هذا الشهر' },
        }),
    });
};

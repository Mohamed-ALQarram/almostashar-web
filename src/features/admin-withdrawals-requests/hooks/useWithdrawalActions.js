import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectWithdrawal, approveWithdrawal, markWithdrawalPaid } from '../api/withdrawalsApi';

export const useRejectWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => rejectWithdrawal(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawalDetails', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
        },
    });
};

export const useApproveWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => approveWithdrawal(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawalDetails', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
        },
    });
};

export const useMarkWithdrawalPaid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => markWithdrawalPaid(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawalDetails', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
        },
    });
};

import { useQuery } from '@tanstack/react-query';
import { getWithdrawalDetails } from '../api/withdrawalsApi';

const useAdminWithdrawalDetails = (id) => {
    return useQuery({
        queryKey: ['adminWithdrawalDetails', id],
        queryFn: () => getWithdrawalDetails(id),
        enabled: !!id,
        staleTime: 1 * 60 * 1000 // 1 min
    });
};

export default useAdminWithdrawalDetails;

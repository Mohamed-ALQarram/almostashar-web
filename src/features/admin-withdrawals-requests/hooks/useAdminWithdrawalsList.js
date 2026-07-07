import { useQuery } from '@tanstack/react-query';
import { getWithdrawalsList } from '../api/withdrawalsApi';

const useAdminWithdrawalsList = ({ status, cursor, pageSize = 20 }) => {
    return useQuery({
        queryKey: ['adminWithdrawals', status, cursor, pageSize],
        queryFn: () => getWithdrawalsList({ status, cursor, pageSize }),
        staleTime: 1 * 60 * 1000
    });
};
export default useAdminWithdrawalsList;


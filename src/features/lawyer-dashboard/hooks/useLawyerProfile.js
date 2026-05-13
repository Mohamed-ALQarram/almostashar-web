import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileApi from '../api/lawyerProfileApi';

/**
 * Hook to fetch lawyer profile
 * @param {string|number} lawyerId 
 */
export const useLawyerProfile = (lawyerId) => {
    return useQuery({
        queryKey: ['lawyerProfile', lawyerId],
        queryFn: () => profileApi.getLawyerProfile(lawyerId),
        enabled: !!lawyerId,
        staleTime: 1000 * 60 * 5, // 5 min
    });
};

/**
 * Hook to fetch specializations
 */
export const useSpecializations = () => {
    return useQuery({
        queryKey: ['specializations'],
        queryFn: profileApi.getSpecializations,
        staleTime: 1000 * 60 * 30, // 30 min (rarely changes)
    });
};

/**
 * Hook to edit lawyer profile
 */
export const useEditProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => profileApi.editProfile(data),
        onSuccess: (response) => {
            // Invalidate profile query to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['lawyerProfile'] });
            return response;
        },
    });
};

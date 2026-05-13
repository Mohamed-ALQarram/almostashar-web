import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lawyerApi from '../api/lawyerDashboardApi';

// ─── Lawyer Services List ───────────────────────────────────────────
export const useLawyerServices = () => {
    return useQuery({
        queryKey: ['lawyerServices'],
        queryFn: lawyerApi.getLawyerServices,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// ─── Add Lawyer Service ─────────────────────────────────────────────
export const useAddLawyerService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lawyerApi.addLawyerService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawyerServices'] });
        },
    });
};

// ─── Update Lawyer Service ──────────────────────────────────────────
export const useUpdateLawyerService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ serviceId, data }) => lawyerApi.updateLawyerService(serviceId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lawyerServices'] });
        },
    });
};

// ─── Legal Services Catalog ─────────────────────────────────────────
export const useLegalServicesCatalog = () => {
    return useQuery({
        queryKey: ['legalServicesCatalog'],
        queryFn: lawyerApi.getLegalServicesCatalog,
        staleTime: 1000 * 60 * 60, // 1 hour
        select: (data) => {
            const list = Array.isArray(data) ? data : (data?.data || []);
            
            // Filter active services and map to ID-Value pairs (for dropdowns)
            return list
                .filter((service) => service.isActive)
                .map((service) => ({
                    id: service.id,
                    title: service.title,
                    original: service // keeping original data in case we need duration/price defaults
                }));
        },
    });
};

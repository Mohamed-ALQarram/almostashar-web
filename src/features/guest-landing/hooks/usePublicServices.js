import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api/axios';

/**
 * Fetches the full legal services catalog for public display.
 * Unlike useLegalServicesCatalog (which transforms data for dropdowns),
 * this returns the complete service data for the landing page.
 */
export const usePublicServices = () => {
    return useQuery({
        queryKey: ['publicLegalServices'],
        queryFn: () => api.get('/api/legal-services'),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours (public, rarely changes)
        select: (data) => {
            const list = Array.isArray(data) ? data : (data?.data || []);
            return list.filter(s => s.isActive);
        },
    });
};

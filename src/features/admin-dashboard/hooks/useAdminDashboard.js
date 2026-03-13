import { useQuery } from '@tanstack/react-query';
import * as adminDashboardApi from '../api/adminDashboardApi';

// Hooks for Admin Dashboard
// Currently returning dummy data matching the design, to be connected to API later

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: async () => {
            // Dummy data based on design
            // await adminDashboardApi.getDashboardStats();
            return {
                totalBalance: { value: 50000, currency: 'ر.س', trend: '+12%', isPositive: true },
                inEscrow: { value: 12000, currency: 'ر.س', trend: '+5%', isPositive: true },
                availableForWithdrawal: { value: 5000, currency: 'ر.س', trend: null }
            };
        },
    });
};

export const useWithdrawalRequests = () => {
    return useQuery({
        queryKey: ['adminWithdrawalRequests'],
        queryFn: async () => {
            // Dummy data based on design
            // await adminDashboardApi.getWithdrawalRequests();
            return [
                { id: 1, consultantName: 'أحمد محمد', date: '21/10/2023', amount: 1500, currency: 'ر.س', image: 'https://i.pravatar.cc/150?u=ahmed' },
                { id: 2, consultantName: 'سارة علي', date: '21/10/2023', amount: 2300, currency: 'ر.س', image: 'https://i.pravatar.cc/150?u=sara' },
            ];
        },
    });
};

export const useOpenDisputes = () => {
    return useQuery({
        queryKey: ['adminOpenDisputes'],
        queryFn: async () => {
            // Dummy data based on design
            // await adminDashboardApi.getOpenDisputes();
            return [
                { id: '#9821', issue: 'عدم الرضا عن الاستشارة', status: 'تحت المراجعة', statusColor: 'warning' },
                { id: '#9825', issue: 'تأخر الرد من المستشار', status: 'مفتوحة', statusColor: 'error' },
            ];
        },
    });
};

export const useTopConsultants = () => {
    return useQuery({
        queryKey: ['adminTopConsultants'],
        queryFn: async () => {
            // Dummy data based on design
            // await adminDashboardApi.getTopConsultants();
            return [
                { id: 1, name: 'د. خالد العمري', title: 'استشاري قانوني', rating: 5, reviews: 150, image: 'https://i.pravatar.cc/150?u=khaled' },
                { id: 2, name: 'أ. ليلى السعيد', title: 'مستشارة مالية', rating: 4.5, reviews: 120, image: 'https://i.pravatar.cc/150?u=layla' },
                { id: 3, name: 'د. يوسف ناصح', title: 'استشاري نفسي', rating: 4, reviews: 98, image: 'https://i.pravatar.cc/150?u=yousef' },
            ];
        },
    });
};

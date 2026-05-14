import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lawyerApi from '../api/lawyerDashboardApi';
import { decryptMessagesForChat } from '../e2ee/messages';

// ─── Analytics ──────────────────────────────────────────────────────
export const useLawyerAnalytics = () => {
    return useQuery({
        queryKey: ['lawyerAnalytics'],
        queryFn: lawyerApi.getAnalytics,
        staleTime: 1000 * 60 * 5, // 5 min
    });
};

// ─── Incoming Requests ──────────────────────────────────────────────
/**
 * Fetches incoming direct requests.
 * Pass { status: 'Pending' } to get only pending requests.
 * The top-4 are displayed on the dashboard; the full list can be
 * reused on the dedicated "الطلبات" page via the same cache key.
 */
export const useIncomingRequests = (params = {}) => {
    return useQuery({
        queryKey: ['incomingRequests', params],
        queryFn: () => lawyerApi.getIncomingRequests(params),
        staleTime: 1000 * 60 * 2, // 2 min
    });
};

// ─── Active Cases ───────────────────────────────────────────────────
export const useActiveCases = (limit = 5) => {
    return useQuery({
        queryKey: ['activeCases', limit],
        queryFn: () => lawyerApi.getActiveCases(limit),
        staleTime: 1000 * 60 * 3, // 3 min
    });
};

// ─── Notifications ──────────────────────────────────────────────────
export const useNotifications = (params = {}) => {
    return useQuery({
        queryKey: ['notifications', params],
        queryFn: () => lawyerApi.getNotifications(params),
        staleTime: 1000 * 60 * 1, // 1 min
    });
};

// ─── Mark Notifications as Read (Mutation) ──────────────────────────
export const useMarkNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lastReadId) => lawyerApi.markNotificationsAsRead(lastReadId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

// ─── Chats List ─────────────────────────────────────────────────────
export const useChats = (params = {}) => {
    return useQuery({
        queryKey: ['chats', params],
        queryFn: () => lawyerApi.getChats(params),
        staleTime: 1000 * 60 * 1, // 1 min
    });
};

// ─── Chat Messages ──────────────────────────────────────────────────
export const useChatMessages = (chatId, pageSize = 20) => {
    return useQuery({
        queryKey: ['chatMessages', chatId],
        queryFn: async () => {
            const data = await lawyerApi.getChatMessages({ ChatId: chatId, PageSize: pageSize });
            return decryptMessagesForChat(chatId, data);
        },
        enabled: !!chatId,
        staleTime: 1000 * 30, // 30 sec
    });
};

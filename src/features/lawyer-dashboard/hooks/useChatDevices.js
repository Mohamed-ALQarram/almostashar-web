import { useQuery } from '@tanstack/react-query';
import { prepareChatDevices } from '../e2ee/messages';
import { useAuthStore } from '../../auth/store/authStore';

const useChatDevices = (chatId) => {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ['chatDevices', chatId, userId],
        queryFn: () => prepareChatDevices(chatId, userId),
        enabled: !!chatId,
        staleTime: 1000 * 60,
    });
};

export default useChatDevices;

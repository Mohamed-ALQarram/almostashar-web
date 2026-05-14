import { useQuery } from '@tanstack/react-query';
import { prepareChatDevices } from '../e2ee/messages';

const useChatDevices = (chatId) => {
    return useQuery({
        queryKey: ['chatDevices', chatId],
        queryFn: () => prepareChatDevices(chatId),
        enabled: !!chatId,
        staleTime: 1000 * 60,
    });
};

export default useChatDevices;

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startChatHub, getChatHubConnection } from '../signalr/chatHub';
import { useChatStore } from '../store/chatStore';
import { markMessagesAsRead } from '../api/lawyerDashboardApi';

/**
 * Starts the SignalR hub and subscribes to ReceiveMessage & ReceiveTypingIndicator.
 *
 * Call this ONCE at the page level (e.g. LawyerChatsPage), not in ChatArea.
 * Protected against duplicate subscriptions via ref flag.
 */
const useChatSignalR = () => {
    const queryClient = useQueryClient();
    const setTyping = useChatStore((s) => s.setTyping);
    const clearTyping = useChatStore((s) => s.clearTyping);
    const subscribedRef = useRef(false);

    useEffect(() => {
        let hub;

        const setup = async () => {
            hub = await startChatHub();

            if (!hub || subscribedRef.current) return;
            subscribedRef.current = true;

            // ── ReceiveMessage ──────────────────────────────────
            hub.off('ReceiveMessage');
            hub.on('ReceiveMessage', (chatId, message) => {
                // Append to the correct chat's message cache
                queryClient.setQueryData(['chatMessages', chatId], (oldData) => {
                    if (!oldData) return oldData;

                    // Current cache shape: { items: [...], nextCursor, hasMore, ... }
                    const items = oldData.items || [];

                    // Dedup by messageId
                    if (items.some((m) => m.messageId === message.messageId)) {
                        return oldData;
                    }

                    // API returns descending, new messages go at the start (index 0)
                    return {
                        ...oldData,
                        items: [message, ...items],
                    };
                });

                // Refresh chats list to update last message / unread count
                queryClient.invalidateQueries({ queryKey: ['chats'] });

                // Clear typing indicator for this chat
                clearTyping(chatId);

                // Auto mark-as-read if this chat is currently open
                const activeChatId = useChatStore.getState().activeChatId;
                if (activeChatId === chatId && message.messageId) {
                    markMessagesAsRead(chatId, message.messageId)
                        .then(() => queryClient.invalidateQueries({ queryKey: ['chats'] }))
                        .catch((err) => console.warn('[MarkRead] auto mark-read failed:', err));
                }
            });

            // ── ReceiveTypingIndicator ──────────────────────────
            hub.off('ReceiveTypingIndicator');
            hub.on('ReceiveTypingIndicator', (chatId, senderId, isTyping) => {
                if (isTyping) {
                    setTyping(chatId, senderId);
                } else {
                    clearTyping(chatId);
                }
            });
        };

        setup();

        return () => {
            // Clean up listeners but do NOT stop the connection
            // (other pages may reuse it; stopChatHub is called on logout)
            if (hub) {
                hub.off('ReceiveMessage');
                hub.off('ReceiveTypingIndicator');
            }
            subscribedRef.current = false;
        };
    }, [queryClient, setTyping, clearTyping]);
};

export default useChatSignalR;


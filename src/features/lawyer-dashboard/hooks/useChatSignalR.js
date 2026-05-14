import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startChatHub } from '../signalr/chatHub';
import { useChatStore } from '../store/chatStore';
import { markMessagesAsRead } from '../api/lawyerDashboardApi';
import { decryptSingleMessageForChat } from '../e2ee/messages';
import { ensureLocalDeviceIdentity } from '../e2ee/deviceIdentity';
import { useAuthStore } from '../../auth/store/authStore';

const SECURE_MESSAGING_LOGIN_MESSAGE =
    'Please login again to activate secure messaging on this device.';

const tokenHasDeviceClaim = (token) => {
    try {
        const payload = token.split('.')[1];
        const padded = payload.replace(/-/g, '+').replace(/_/g, '/')
            + '==='.slice((payload.length + 3) % 4);
        const claims = JSON.parse(atob(padded));

        return Boolean(claims.device_id || claims.deviceId || claims.DeviceId);
    } catch {
        return false;
    }
};

/**
 * Starts the SignalR hub and subscribes to encrypted messages and typing events.
 *
 * Call this once at the page level. Incoming encrypted messages are cached
 * immediately, then replaced with a decrypted in-memory copy when possible.
 */
const useChatSignalR = () => {
    const queryClient = useQueryClient();
    const setTyping = useChatStore((s) => s.setTyping);
    const clearTyping = useChatStore((s) => s.clearTyping);
    const subscribedRef = useRef(false);

    useEffect(() => {
        let hub;

        const setup = async () => {
            await ensureLocalDeviceIdentity();

            const token = useAuthStore.getState().accessToken;
            if (token && !tokenHasDeviceClaim(token)) {
                sessionStorage.setItem('almostashar-login-message', SECURE_MESSAGING_LOGIN_MESSAGE);
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return;
            }

            hub = await startChatHub();

            if (!hub || subscribedRef.current) return;
            subscribedRef.current = true;

            hub.off('ReceiveEncryptedMessage');
            hub.on('ReceiveEncryptedMessage', (...args) => {
                const chatId = typeof args[0] === 'number' ? args[0] : args[0]?.chatId;
                const encryptedMessage = typeof args[0] === 'number' ? args[1] : args[0];

                if (!chatId || !encryptedMessage) return;

                queryClient.setQueryData(['chatMessages', chatId], (oldData) => {
                    if (!oldData) return oldData;

                    const items = oldData.items || [];
                    if (items.some((m) => m.messageId === encryptedMessage.messageId)) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        items: [
                            {
                                ...encryptedMessage,
                                content: '',
                                decryptionStatus: 'encrypted-pending',
                            },
                            ...items,
                        ],
                    };
                });

                decryptSingleMessageForChat(chatId, encryptedMessage)
                    .then((decryptedMessage) => {
                        queryClient.setQueryData(['chatMessages', chatId], (oldData) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                items: (oldData.items || []).map((item) =>
                                    item.messageId === encryptedMessage.messageId
                                        ? decryptedMessage
                                        : item
                                ),
                            };
                        });
                    })
                    .catch((err) => console.warn('[E2EE] realtime decrypt failed:', err));

                queryClient.invalidateQueries({ queryKey: ['chats'] });
                clearTyping(chatId);

                const activeChatId = useChatStore.getState().activeChatId;
                if (activeChatId === chatId && encryptedMessage.messageId) {
                    markMessagesAsRead(chatId, encryptedMessage.messageId)
                        .then(() => queryClient.invalidateQueries({ queryKey: ['chats'] }))
                        .catch((err) => console.warn('[MarkRead] auto mark-read failed:', err));
                }
            });

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
            if (hub) {
                hub.off('ReceiveEncryptedMessage');
                hub.off('ReceiveTypingIndicator');
            }
            subscribedRef.current = false;
        };
    }, [queryClient, setTyping, clearTyping]);
};

export default useChatSignalR;

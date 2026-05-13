import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startChatHub } from '../signalr/chatHub';
import { uploadChatDocument } from '../api/documentUploadApi';

/**
 * Hook for sending messages through SignalR.
 *
 * Supports text, image, and document messages.
 * For file messages: uploads to REST first, then sends documentUrl via SignalR.
 *
 * @returns {{ sendMessage, isSending, error }}
 */
const useSendMessage = () => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const sendMessage = useCallback(
        async ({ chatId, receiverId, content, file }) => {
            setIsSending(true);
            setError(null);

            try {
                const hub = await startChatHub();

                let messageType = 'Text';
                let documentUrl = null;
                let documentName = null;

                // ── File upload (if any) ────────────────────────────
                if (file) {
                    const fileUrl = await uploadChatDocument(file);
                    documentUrl = fileUrl;
                    documentName = file.name;
                    messageType =
                        file.type && file.type.startsWith('image/')
                            ? 'Image'
                            : 'Document';
                }

                // ── Send via SignalR ────────────────────────────────
                const sentMessage = await hub.invoke('SendMessage', {
                    chatId,
                    receiverId,
                    content: content || '',
                    messageType,
                    documentName,
                    documentUrl,
                });

                // ── Update cache ────────────────────────────────────
                if (sentMessage) {
                    queryClient.setQueryData(
                        ['chatMessages', chatId],
                        (oldData) => {
                            if (!oldData) return oldData;

                            const items = oldData.items || [];

                            // Dedup by messageId (ReceiveMessage may have already added it)
                            if (items.some((m) => m.messageId === sentMessage.messageId)) {
                                return oldData;
                            }

                            return {
                                ...oldData,
                                items: [sentMessage, ...items],
                            };
                        }
                    );
                }

                // Refresh chats list (last message, unread count)
                queryClient.invalidateQueries({ queryKey: ['chats'] });

                return sentMessage;
            } catch (err) {
                const message =
                    err?.message || err?.toString() || 'فشل إرسال الرسالة';
                console.error('[SendMessage] Error:', err);
                setError(message);
                throw err;
            } finally {
                setIsSending(false);
            }
        },
        [queryClient]
    );

    return { sendMessage, isSending, error, clearError: () => setError(null) };
};

export default useSendMessage;

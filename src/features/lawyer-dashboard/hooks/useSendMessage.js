import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startChatHub } from '../signalr/chatHub';
import { useUploadDocument } from '../../documents';

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
    const { mutateAsync: uploadDocumentAsync, isLoading: isUploadingDocument, error: uploadDocumentError } = useUploadDocument();
    const sendMessage = useCallback(
        async ({ chatId, receiverId, content, file }) => {
            setIsSending(true);
            setError(null);

            try {
                const hub = await startChatHub();

                let messageType = 0; // 0 = Text
                let documentId = null;

                // ── File upload (if any) ────────────────────────────
                if (file) {
                    const document = await uploadDocumentAsync(file);
                    documentId = document?.documentId;

                    const isImage = file.type.startsWith('image/') || document?.type?.startsWith('image/');
                    messageType = isImage ? 1 : 2; // 1 = Image, 2 = Document
                }

                // ── Send via SignalR ────────────────────────────────
                const sentMessage = await hub.invoke('SendMessage', {
                    chatId,
                    receiverId,
                    content: content || '',
                    messageType,
                    documentId,
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

    return { sendMessage, isSending, error, clearError: () => setError(null), isUploadingDocument };
};

export default useSendMessage;

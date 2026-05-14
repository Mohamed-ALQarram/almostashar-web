import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startChatHub } from '../signalr/chatHub';
import { useAuthStore } from '../../auth/store/authStore';
import { createEncryptedMessagePayload, prepareChatDevices } from '../e2ee/messages';
import { ensureLocalDeviceIdentity } from '../e2ee/deviceIdentity';

/**
 * Hook for sending encrypted chat messages through SignalR.
 *
 * Supports text, image, and document messages. Files are encrypted locally
 * before upload; plaintext is never sent to the backend.
 *
 * @returns {{ sendMessage, isSending, error }}
 */
const useSendMessage = () => {
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const clearError = useCallback(() => setError(null), []);

    const sendMessage = useCallback(
        async ({ chatId, content, file }) => {
            setIsSending(true);
            setError(null);

            try {
                const hub = await startChatHub();
                const currentDevice = await ensureLocalDeviceIdentity();
                const { activeDevices, warnings, hasBlockedDevices } = await prepareChatDevices(chatId, user?.id);

                if (hasBlockedDevices) {
                    throw new Error('Peer device key changed. Message was not sent.');
                }

                warnings
                    .filter((warning) => warning.type === 'new-device')
                    .forEach((warning) => console.info('[E2EE]', warning.message, warning.device));

                const recipientDevices = [...activeDevices];
                if (!recipientDevices.some((device) => device.deviceId === currentDevice.deviceId)) {
                    recipientDevices.push({
                        userId: user?.id,
                        deviceId: currentDevice.deviceId,
                        deviceName: currentDevice.deviceName,
                        deviceType: currentDevice.deviceType,
                        identityPublicKey: currentDevice.identityPublicKey,
                        status: 'Active',
                    });
                }

                const encryptedPayload = await createEncryptedMessagePayload({
                    chatId,
                    content,
                    file,
                    currentDevice,
                    recipientDevices,
                });

                const sentMessage = await hub.invoke('SendEncryptedMessage', encryptedPayload);

                if (sentMessage) {
                    const locallyDecryptedMessage = {
                        ...sentMessage,
                        document: encryptedPayload.document,
                        documentUrl: encryptedPayload.document?.storageUrl || sentMessage.documentUrl,
                        documentName: file?.name || sentMessage.documentName,
                        content: content || '',
                        decryptionStatus: 'decrypted',
                    };

                    queryClient.setQueryData(['chatMessages', chatId], (oldData) => {
                        if (!oldData) return oldData;

                        const items = oldData.items || [];
                        if (items.some((m) => m.messageId === sentMessage.messageId)) {
                            return oldData;
                        }

                        return {
                            ...oldData,
                            items: [locallyDecryptedMessage, ...items],
                        };
                    });
                }

                queryClient.invalidateQueries({ queryKey: ['chats'] });

                return sentMessage;
            } catch (err) {
                const rawMessage = err?.message || err?.toString() || '';
                const message = rawMessage.includes('Device.CurrentRequired') || rawMessage.includes('Device.CurrentInactive')
                    ? 'Please login again to activate secure messaging on this device.'
                    : rawMessage || 'فشل إرسال الرسالة';
                console.error('[SendEncryptedMessage] Error:', err);
                setError(message);
                throw err;
            } finally {
                setIsSending(false);
            }
        },
        [queryClient, user?.id]
    );

    return { sendMessage, isSending, error, clearError };
};

export default useSendMessage;

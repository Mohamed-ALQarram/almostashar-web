import { useEffect, useState } from 'react';
import { decryptDocumentName, downloadAndDecryptDocument, unwrapDocumentKey } from '../e2ee/documents';
import { ensureLocalDeviceIdentity } from '../e2ee/deviceIdentity';
import { prepareChatDevices } from '../e2ee/messages';

const useEncryptedDocument = (message) => {
    const [state, setState] = useState({
        url: null,
        name: message?.documentName || null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        let objectUrl = null;
        let cancelled = false;

        const load = async () => {
            const document = message?.document;
            if (!document || !message?.chatId || !message?.senderDeviceId) {
                setState({
                    url: null,
                    name: message?.documentName || null,
                    isLoading: false,
                    error: null,
                });
                return;
            }

            setState((current) => ({
                ...current,
                isLoading: true,
                error: null,
            }));

            try {
                const currentDevice = await ensureLocalDeviceIdentity();
                const { allDevices } = await prepareChatDevices(message.chatId);
                const senderDevice = allDevices.find(
                    (device) => device.deviceId === message.senderDeviceId
                );

                if (!senderDevice && message.senderDeviceId !== currentDevice.deviceId) {
                    throw new Error('Missing sender device public key.');
                }

                const senderPublicKey = senderDevice?.identityPublicKey || currentDevice.identityPublicKey;
                const fileKey = await unwrapDocumentKey({
                    document,
                    currentDevice,
                    senderPublicKey,
                    senderDeviceId: message.senderDeviceId,
                });
                const [blob, decryptedName] = await Promise.all([
                    downloadAndDecryptDocument({ document, fileKey }),
                    decryptDocumentName({ document, fileKey }).catch(() => null),
                ]);

                objectUrl = URL.createObjectURL(blob);

                if (!cancelled) {
                    setState({
                        url: objectUrl,
                        name: decryptedName || message.documentName || 'Encrypted document',
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                console.warn('[E2EE] document decrypt failed:', error);
                if (!cancelled) {
                    setState({
                        url: null,
                        name: message?.documentName || 'Encrypted document',
                        isLoading: false,
                        error,
                    });
                }
            }
        };

        load();

        return () => {
            cancelled = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [message]);

    return state;
};

export default useEncryptedDocument;

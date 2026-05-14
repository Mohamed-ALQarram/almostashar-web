import { getChatParticipantDevices } from '../api/lawyerDashboardApi';
import {
    aesGcmDecryptText,
    aesGcmEncryptText,
    generateContentKey,
    unwrapContentKey,
    wrapContentKeyForDevice,
} from './crypto';
import { createEncryptedDocumentPayload, decryptDocumentName } from './documents';
import { ensureLocalDeviceIdentity } from './deviceIdentity';
import { normalizeParticipantDevices, updateTrustedDevices } from './trustedDevices';

const getMessageKeys = (message) =>
    message?.keys || message?.messageKeys || message?.MessageKeys || [];

const getDocument = (message) => message?.document || message?.Document || null;

const isActiveStatus = (status) =>
    status === undefined
    || status === null
    || status === 0
    || String(status).toLowerCase() === 'active';

const getActiveDevices = (devices) =>
    devices.filter((device) =>
        device.deviceId
        && device.identityPublicKey
        && isActiveStatus(device.status)
    );

const buildDeviceMap = (devices, currentDevice) => {
    const map = new Map();
    devices.forEach((device) => {
        if (device.deviceId && device.identityPublicKey) {
            map.set(device.deviceId, device.identityPublicKey);
        }
    });
    map.set(currentDevice.deviceId, currentDevice.identityPublicKey);
    return map;
};

export const prepareChatDevices = async (chatId) => {
    const response = await getChatParticipantDevices(chatId);
    const allDevices = normalizeParticipantDevices(response);
    const trust = updateTrustedDevices(allDevices);
    const activeDevices = getActiveDevices(allDevices).filter(
        (device) => !trust.blockedDeviceIds.has(device.deviceId)
    );

    return {
        allDevices,
        activeDevices,
        warnings: trust.warnings,
        hasBlockedDevices: trust.blockedDeviceIds.size > 0,
    };
};

export const createEncryptedMessagePayload = async ({
    chatId,
    content,
    file,
    currentDevice,
    recipientDevices,
}) => {
    const messageContentKey = await generateContentKey();
    const encryptedMessage = await aesGcmEncryptText(messageContentKey, content || '');
    const messageKeys = await Promise.all(
        recipientDevices.map((device) =>
            wrapContentKeyForDevice({
                contentKey: messageContentKey,
                senderPrivateKey: currentDevice.privateKey,
                senderDeviceId: currentDevice.deviceId,
                recipientUserId: device.userId,
                recipientDeviceId: device.deviceId,
                recipientPublicKey: device.identityPublicKey,
                resourceType: 'ChatMessage',
            })
        )
    );

    let messageType = 'Text';
    let document = null;

    if (file) {
        messageType = content
            ? 'TextWithAttachment'
            : file.type?.startsWith('image/')
                ? 'Image'
                : 'Document';
        document = await createEncryptedDocumentPayload({
            file,
            currentDevice,
            senderPrivateKey: currentDevice.privateKey,
            recipientDevices,
        });
    }

    return {
        chatId,
        senderDeviceId: currentDevice.deviceId,
        messageType,
        ciphertext: encryptedMessage.ciphertext,
        nonce: encryptedMessage.nonce,
        tag: encryptedMessage.tag,
        messageKeys,
        document,
    };
};

export const decryptChatMessage = async ({
    message,
    currentDevice,
    devicePublicKeys,
}) => {
    if (!message?.ciphertext && typeof message?.content === 'string') {
        return {
            ...message,
            decryptionStatus: 'legacy-plaintext',
        };
    }

    const encryptedKey = getMessageKeys(message).find(
        (key) => key.recipientDeviceId === currentDevice.deviceId
    );

    if (!encryptedKey) {
        return {
            ...message,
            content: '',
            decryptionStatus: 'missing-key',
            decryptionError: 'This message was not encrypted for this device.',
        };
    }

    const senderPublicKey = devicePublicKeys.get(message.senderDeviceId);
    if (!senderPublicKey) {
        return {
            ...message,
            content: '',
            decryptionStatus: 'missing-sender-device',
            decryptionError: 'Unable to find sender device key.',
        };
    }

    try {
        const messageKey = await unwrapContentKey({
            encryptedKey,
            myPrivateKey: currentDevice.privateKey,
            senderPublicKey,
            senderDeviceId: message.senderDeviceId,
            myDeviceId: currentDevice.deviceId,
            resourceType: 'ChatMessage',
        });
        const content = await aesGcmDecryptText(
            messageKey,
            message.ciphertext,
            message.nonce,
            message.tag
        );
        const document = getDocument(message);
        let decryptedDocumentName = null;

        if (document) {
            const documentKey = getMessageKeys({ keys: document.keys || document.documentKeys }).find(
                (key) => key.recipientDeviceId === currentDevice.deviceId
            );

            if (documentKey) {
                const fileKey = await unwrapContentKey({
                    encryptedKey: documentKey,
                    myPrivateKey: currentDevice.privateKey,
                    senderPublicKey,
                    senderDeviceId: message.senderDeviceId,
                    myDeviceId: currentDevice.deviceId,
                    resourceType: 'CaseDocument',
                });
                decryptedDocumentName = await decryptDocumentName({ document, fileKey }).catch(() => null);
            }
        }

        return {
            ...message,
            document,
            documentUrl: document?.storageUrl || message.documentUrl,
            documentName: decryptedDocumentName || message.documentName,
            content,
            decryptionStatus: 'decrypted',
        };
    } catch (error) {
        console.warn('[E2EE] Unable to decrypt chat message:', error);
        return {
            ...message,
            content: '',
            decryptionStatus: 'failed',
            decryptionError: 'Unable to decrypt this message.',
        };
    }
};

export const decryptMessagesForChat = async (chatId, messagesResponse) => {
    const currentDevice = await ensureLocalDeviceIdentity();
    const { allDevices } = await prepareChatDevices(chatId);
    const devicePublicKeys = buildDeviceMap(allDevices, currentDevice);
    const items = messagesResponse?.items || (Array.isArray(messagesResponse) ? messagesResponse : []);
    const decryptedItems = await Promise.all(
        items.map((message) => decryptChatMessage({ message, currentDevice, devicePublicKeys }))
    );

    if (Array.isArray(messagesResponse)) {
        return decryptedItems;
    }

    return {
        ...messagesResponse,
        items: decryptedItems,
    };
};

export const decryptSingleMessageForChat = async (chatId, message) => {
    const currentDevice = await ensureLocalDeviceIdentity();
    const { allDevices } = await prepareChatDevices(chatId);
    const devicePublicKeys = buildDeviceMap(allDevices, currentDevice);
    return decryptChatMessage({ message, currentDevice, devicePublicKeys });
};

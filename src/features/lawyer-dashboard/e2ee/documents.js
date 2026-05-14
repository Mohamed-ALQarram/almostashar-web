import { uploadEncryptedDocumentBytes } from '../api/documentUploadApi';
import { getPresignedUrl } from '../api/lawyerDashboardApi';
import {
    aesGcmDecryptRawBytes,
    aesGcmDecryptText,
    aesGcmEncryptBytesRaw,
    aesGcmEncryptText,
    generateContentKey,
    unwrapContentKey,
    wrapContentKeyForDevice,
} from './crypto';

const getDocumentKeys = (document) =>
    document?.keys || document?.documentKeys || document?.DocumentKeys || [];

const getStorageUrl = (document) =>
    document?.storageUrl || document?.documentUrl || document?.fileUrl;

export const createEncryptedDocumentPayload = async ({
    file,
    currentDevice,
    senderPrivateKey,
    recipientDevices,
}) => {
    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const fileContentKey = await generateContentKey();
    const encryptedFile = await aesGcmEncryptBytesRaw(fileContentKey, fileBytes);
    const encryptedBytes = new Blob(
        [encryptedFile.ciphertextBytes],
        { type: 'application/octet-stream' }
    );
    const storageUrl = await uploadEncryptedDocumentBytes(encryptedBytes);
    const encryptedName = await aesGcmEncryptText(fileContentKey, file.name);
    const documentKeys = await Promise.all(
        recipientDevices.map((device) =>
            wrapContentKeyForDevice({
                contentKey: fileContentKey,
                senderPrivateKey,
                senderDeviceId: currentDevice.deviceId,
                recipientUserId: device.userId,
                recipientDeviceId: device.deviceId,
                recipientPublicKey: device.identityPublicKey,
                resourceType: 'CaseDocument',
            })
        )
    );

    return {
        storageUrl,
        encryptedDocumentName: encryptedName.ciphertext,
        documentNameNonce: encryptedName.nonce,
        documentNameTag: encryptedName.tag,
        fileNonce: encryptedFile.nonce,
        fileTag: encryptedFile.tag,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        documentKeys,
    };
};

export const decryptDocumentName = async ({
    document,
    fileKey,
}) => {
    if (!document?.encryptedDocumentName || !document?.documentNameNonce || !document?.documentNameTag) {
        return null;
    }

    return aesGcmDecryptText(
        fileKey,
        document.encryptedDocumentName,
        document.documentNameNonce,
        document.documentNameTag
    );
};

export const unwrapDocumentKey = async ({
    document,
    currentDevice,
    senderPublicKey,
    senderDeviceId,
}) => {
    const encryptedKey = getDocumentKeys(document).find(
        (key) => key.recipientDeviceId === currentDevice.deviceId
    );

    if (!encryptedKey) {
        const error = new Error('Missing encrypted document key for this device.');
        error.code = 'EncryptedKeys.Missing';
        throw error;
    }

    return unwrapContentKey({
        encryptedKey,
        myPrivateKey: currentDevice.privateKey,
        senderPublicKey,
        senderDeviceId,
        myDeviceId: currentDevice.deviceId,
        resourceType: 'CaseDocument',
    });
};

export const downloadAndDecryptDocument = async ({
    document,
    fileKey,
}) => {
    const filePath = getStorageUrl(document);
    const presigned = await getPresignedUrl(filePath);
    const url = presigned?.url || presigned;
    const encryptedBytes = new Uint8Array(await fetch(url).then((response) => response.arrayBuffer()));
    const plaintext = await aesGcmDecryptRawBytes(
        fileKey,
        encryptedBytes,
        document.fileNonce,
        document.fileTag
    );

    return new Blob([plaintext], {
        type: document.mimeType || 'application/octet-stream',
    });
};

// TODO: Standalone case/request documents need backend createdByDeviceId or
// encryptionSenderDeviceId before they can be decrypted outside chat context.

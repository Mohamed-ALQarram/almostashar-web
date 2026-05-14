import {
    base64UrlToBytes,
    bytesToBase64Url,
    bytesToUtf8,
    concatBytes,
    utf8ToBytes,
} from './encoding';

const AES_GCM_TAG_BYTES = 16;
const AES_GCM_NONCE_BYTES = 12;

const getSubtle = () => {
    if (!window.crypto?.subtle) {
        throw new Error('WebCrypto is not available in this browser.');
    }

    return window.crypto.subtle;
};

export const randomBytes = (size) => {
    const bytes = new Uint8Array(size);
    window.crypto.getRandomValues(bytes);
    return bytes;
};

export const generateDeviceKeyPair = () =>
    getSubtle().generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        false,
        ['deriveBits']
    );

export const exportPublicKeyRaw = async (publicKey) => {
    const raw = await getSubtle().exportKey('raw', publicKey);
    return bytesToBase64Url(new Uint8Array(raw));
};

export const importPeerPublicKey = (publicKeyBase64Url) =>
    getSubtle().importKey(
        'raw',
        base64UrlToBytes(publicKeyBase64Url),
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        false,
        []
    );

export const generateContentKey = () =>
    getSubtle().generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

export const importContentKey = (rawKeyBytes) =>
    getSubtle().importKey(
        'raw',
        rawKeyBytes,
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

export const exportContentKey = async (contentKey) => {
    const raw = await getSubtle().exportKey('raw', contentKey);
    return new Uint8Array(raw);
};

export const aesGcmEncryptBytes = async (key, plaintextBytes) => {
    const nonce = randomBytes(AES_GCM_NONCE_BYTES);
    const encrypted = new Uint8Array(
        await getSubtle().encrypt(
            {
                name: 'AES-GCM',
                iv: nonce,
            },
            key,
            plaintextBytes
        )
    );

    const ciphertext = encrypted.slice(0, encrypted.length - AES_GCM_TAG_BYTES);
    const tag = encrypted.slice(encrypted.length - AES_GCM_TAG_BYTES);

    return {
        ciphertext: bytesToBase64Url(ciphertext),
        nonce: bytesToBase64Url(nonce),
        tag: bytesToBase64Url(tag),
    };
};

export const aesGcmDecryptBytes = async (key, ciphertext, nonce, tag) => {
    const encrypted = concatBytes(base64UrlToBytes(ciphertext), base64UrlToBytes(tag));
    const plaintext = await getSubtle().decrypt(
        {
            name: 'AES-GCM',
            iv: base64UrlToBytes(nonce),
        },
        key,
        encrypted
    );

    return new Uint8Array(plaintext);
};

export const aesGcmEncryptText = (key, plaintext) =>
    aesGcmEncryptBytes(key, utf8ToBytes(plaintext));

export const aesGcmDecryptText = async (key, ciphertext, nonce, tag) => {
    const plaintextBytes = await aesGcmDecryptBytes(key, ciphertext, nonce, tag);
    return bytesToUtf8(plaintextBytes);
};

export const deriveWrappingKey = async ({
    privateKey,
    peerPublicKeyBase64Url,
    senderDeviceId,
    recipientDeviceId,
    resourceType,
}) => {
    const peerPublicKey = await importPeerPublicKey(peerPublicKeyBase64Url);
    const sharedBits = await getSubtle().deriveBits(
        {
            name: 'ECDH',
            public: peerPublicKey,
        },
        privateKey,
        256
    );

    const sharedKey = await getSubtle().importKey(
        'raw',
        sharedBits,
        'HKDF',
        false,
        ['deriveKey']
    );

    return getSubtle().deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: utf8ToBytes(`AM-E2EE-v1|salt|${senderDeviceId}|${recipientDeviceId}`),
            info: utf8ToBytes(`AM-E2EE-v1|wrap|${resourceType}|${senderDeviceId}|${recipientDeviceId}`),
        },
        sharedKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt', 'decrypt']
    );
};

export const wrapContentKeyForDevice = async ({
    contentKey,
    senderPrivateKey,
    senderDeviceId,
    recipientUserId,
    recipientDeviceId,
    recipientPublicKey,
    resourceType,
}) => {
    const wrappingKey = await deriveWrappingKey({
        privateKey: senderPrivateKey,
        peerPublicKeyBase64Url: recipientPublicKey,
        senderDeviceId,
        recipientDeviceId,
        resourceType,
    });

    const encrypted = await aesGcmEncryptBytes(wrappingKey, await exportContentKey(contentKey));

    return {
        recipientUserId,
        recipientDeviceId,
        encryptedContentKey: encrypted.ciphertext,
        keyNonce: encrypted.nonce,
        keyTag: encrypted.tag,
    };
};

export const unwrapContentKey = async ({
    encryptedKey,
    myPrivateKey,
    senderPublicKey,
    senderDeviceId,
    myDeviceId,
    resourceType,
}) => {
    const wrappingKey = await deriveWrappingKey({
        privateKey: myPrivateKey,
        peerPublicKeyBase64Url: senderPublicKey,
        senderDeviceId,
        recipientDeviceId: myDeviceId,
        resourceType,
    });

    const rawContentKey = await aesGcmDecryptBytes(
        wrappingKey,
        encryptedKey.encryptedContentKey,
        encryptedKey.keyNonce,
        encryptedKey.keyTag
    );

    return importContentKey(rawContentKey);
};

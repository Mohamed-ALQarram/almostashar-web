import {
    base64ToBytes,
    bytesToBase64,
    bytesToUtf8,
    concatBytes,
    utf8ToBytes,
} from './encoding';

const AES_GCM_TAG_BYTES = 16;
const AES_GCM_NONCE_BYTES = 12;
const P256_RAW_PUBLIC_KEY_BYTES = 65;
const P256_UNCOMPRESSED_PREFIX = 0x04;

// Flutter/mobile clients must match these strings byte-for-byte with UTF-8.
// Do not change them casually after encrypted data exists.
export const E2EE_PROTOCOL_VERSION = 'AM-E2EE-v1';

export const buildHkdfSalt = ({ senderDeviceId, recipientDeviceId }) =>
    `${E2EE_PROTOCOL_VERSION}|salt|${senderDeviceId}|${recipientDeviceId}`;

export const buildHkdfInfo = ({ resourceType, senderDeviceId, recipientDeviceId }) =>
    `${E2EE_PROTOCOL_VERSION}|wrap|${resourceType}|${senderDeviceId}|${recipientDeviceId}`;

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

export const validateRawP256PublicKey = (publicKeyBytes) => {
    if (publicKeyBytes.length !== P256_RAW_PUBLIC_KEY_BYTES) {
        throw new Error(`Invalid P-256 public key length: expected 65 bytes, got ${publicKeyBytes.length}.`);
    }

    if (publicKeyBytes[0] !== P256_UNCOMPRESSED_PREFIX) {
        throw new Error('Invalid P-256 public key format: expected uncompressed key starting with 0x04.');
    }
};

export const generateDeviceKeyPair = async () => {
    // Generate extractable only long enough to export PKCS8, then immediately
    // re-import the private key as non-extractable before IndexedDB storage.
    const generated = await getSubtle().generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        true,
        ['deriveBits']
    );

    const privatePkcs8 = await getSubtle().exportKey('pkcs8', generated.privateKey);
    const privateKey = await getSubtle().importKey(
        'pkcs8',
        privatePkcs8,
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        false,
        ['deriveBits']
    );

    return {
        publicKey: generated.publicKey,
        privateKey,
    };
};

export const exportPublicKeyRaw = async (publicKey) => {
    const raw = new Uint8Array(await getSubtle().exportKey('raw', publicKey));
    validateRawP256PublicKey(raw);
    // Transport format: standard Base64 of raw uncompressed P-256 public key.
    // Flutter should decode this with base64Decode(value).
    return bytesToBase64(raw);
};

export const importPeerPublicKey = (publicKeyBase64) => {
    const publicKeyBytes = base64ToBytes(publicKeyBase64);
    validateRawP256PublicKey(publicKeyBytes);

    return getSubtle().importKey(
        'raw',
        publicKeyBytes,
        {
            name: 'ECDH',
            namedCurve: 'P-256',
        },
        false,
        []
    );
};

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

export const aesGcmEncryptBytesRaw = async (key, plaintextBytes) => {
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

    const ciphertextBytes = encrypted.slice(0, encrypted.length - AES_GCM_TAG_BYTES);
    const tag = encrypted.slice(encrypted.length - AES_GCM_TAG_BYTES);

    return {
        ciphertextBytes,
        nonce: bytesToBase64(nonce),
        tag: bytesToBase64(tag),
    };
};

export const aesGcmEncryptBytes = async (key, plaintextBytes) => {
    const encrypted = await aesGcmEncryptBytesRaw(key, plaintextBytes);

    return {
        ciphertext: bytesToBase64(encrypted.ciphertextBytes),
        nonce: encrypted.nonce,
        tag: encrypted.tag,
    };
};

export const aesGcmDecryptRawBytes = async (key, ciphertextBytes, nonce, tag) => {
    const encrypted = concatBytes(ciphertextBytes, base64ToBytes(tag));
    const plaintext = await getSubtle().decrypt(
        {
            name: 'AES-GCM',
            iv: base64ToBytes(nonce),
        },
        key,
        encrypted
    );

    return new Uint8Array(plaintext);
};

export const aesGcmDecryptBytes = (key, ciphertext, nonce, tag) =>
    aesGcmDecryptRawBytes(key, base64ToBytes(ciphertext), nonce, tag);

export const aesGcmEncryptText = (key, plaintext) =>
    aesGcmEncryptBytes(key, utf8ToBytes(plaintext));

export const aesGcmDecryptText = async (key, ciphertext, nonce, tag) => {
    const plaintextBytes = await aesGcmDecryptBytes(key, ciphertext, nonce, tag);
    return bytesToUtf8(plaintextBytes);
};

export const deriveWrappingKey = async ({
    privateKey,
    peerPublicKeyBase64,
    senderDeviceId,
    recipientDeviceId,
    resourceType,
}) => {
    const peerPublicKey = await importPeerPublicKey(peerPublicKeyBase64);
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
            salt: utf8ToBytes(buildHkdfSalt({ senderDeviceId, recipientDeviceId })),
            info: utf8ToBytes(buildHkdfInfo({ resourceType, senderDeviceId, recipientDeviceId })),
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
        peerPublicKeyBase64: recipientPublicKey,
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
        peerPublicKeyBase64: senderPublicKey,
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

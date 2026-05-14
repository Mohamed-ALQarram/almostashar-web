import { exportPublicKeyRaw, generateDeviceKeyPair } from './crypto';

const DB_NAME = 'almostashar-e2ee';
const DB_VERSION = 1;
const KEY_STORE = 'keys';
const STATE_STORAGE_KEY = 'almostashar-e2ee-device';
const PRIVATE_KEY_ID = 'current-device-private-key';
const PUBLIC_KEY_ID = 'current-device-public-key';

const openDb = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(KEY_STORE)) {
                db.createObjectStore(KEY_STORE);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

const readKey = async (keyId) => {
    const db = await openDb();

    return new Promise((resolve, reject) => {
        const request = db.transaction(KEY_STORE, 'readonly').objectStore(KEY_STORE).get(keyId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

const writeKey = async (keyId, value) => {
    const db = await openDb();

    return new Promise((resolve, reject) => {
        const request = db.transaction(KEY_STORE, 'readwrite').objectStore(KEY_STORE).put(value, keyId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

const readStoredState = () => {
    try {
        return JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) || 'null');
    } catch {
        return null;
    }
};

const writeStoredState = (state) => {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
};

const getDeviceName = () => {
    const browser = navigator.userAgentData?.brands?.[0]?.brand || navigator.userAgent.split(' ')[0] || 'Browser';
    const platform = navigator.userAgentData?.platform || navigator.platform || 'Web';
    return `${browser} on ${platform}`;
};

export const getStoredDeviceState = () => readStoredState();

export const getStoredDeviceId = () => readStoredState()?.deviceId || null;

export const ensureLocalDeviceIdentity = async () => {
    const existingState = readStoredState();
    const privateKey = await readKey(PRIVATE_KEY_ID);
    const publicKey = await readKey(PUBLIC_KEY_ID);

    if (existingState?.deviceId && existingState?.identityPublicKey && privateKey && publicKey) {
        return {
            ...existingState,
            privateKey,
            publicKey,
        };
    }

    const keyPair = await generateDeviceKeyPair();
    const identityPublicKey = await exportPublicKeyRaw(keyPair.publicKey);
    const now = new Date().toISOString();
    const state = {
        deviceId: existingState?.deviceId || crypto.randomUUID(),
        deviceName: existingState?.deviceName || getDeviceName(),
        deviceType: 'Web',
        identityPublicKey,
        privateKeyRef: PRIVATE_KEY_ID,
        createdAt: existingState?.createdAt || now,
    };

    await writeKey(PRIVATE_KEY_ID, keyPair.privateKey);
    await writeKey(PUBLIC_KEY_ID, keyPair.publicKey);
    writeStoredState(state);

    return {
        ...state,
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
    };
};

export const buildRegisterDevicePayload = (device) => ({
    deviceId: device.deviceId,
    deviceName: device.deviceName,
    deviceType: device.deviceType,
    identityPublicKey: device.identityPublicKey,
});

const TRUST_STORAGE_KEY = 'almostashar-e2ee-trusted-devices';

const getTrustKey = (userId, deviceId) => `${userId}:${deviceId}`;

const readTrustMap = () => {
    try {
        return JSON.parse(localStorage.getItem(TRUST_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

const writeTrustMap = (trustMap) => {
    localStorage.setItem(TRUST_STORAGE_KEY, JSON.stringify(trustMap));
};

export const normalizeParticipantDevices = (response) => {
    const participants = response?.participants || response?.Participants || [];

    return participants.flatMap((participant) => {
        const userId = participant.userId ?? participant.UserId;
        const devices = participant.devices || participant.Devices || [];

        return devices.map((device) => ({
            id: device.id ?? device.Id,
            userId,
            deviceId: device.deviceId ?? device.DeviceId,
            deviceName: device.deviceName ?? device.DeviceName,
            deviceType: device.deviceType ?? device.DeviceType,
            identityPublicKey: device.identityPublicKey ?? device.IdentityPublicKey,
            status: device.status ?? device.Status,
            createdAt: device.createdAt ?? device.CreatedAt,
            lastSeenAt: device.lastSeenAt ?? device.LastSeenAt,
            revokedAt: device.revokedAt ?? device.RevokedAt,
        }));
    });
};

export const updateTrustedDevices = (devices, currentUserId) => {
    const trustMap = readTrustMap();
    const now = new Date().toISOString();
    const warnings = [];
    const blockedDeviceIds = new Set();
    const activeKeys = new Set();

    devices.forEach((device) => {
        if (!device.userId || !device.deviceId || !device.identityPublicKey) return;
        if (String(device.userId) === String(currentUserId)) return;

        const key = getTrustKey(device.userId, device.deviceId);
        const existing = trustMap[key];
        activeKeys.add(key);

        if (!existing) {
            trustMap[key] = {
                userId: device.userId,
                deviceId: device.deviceId,
                identityPublicKey: device.identityPublicKey,
                firstSeenAt: now,
                lastSeenAt: now,
                status: 'trusted',
            };
            warnings.push({
                type: 'new-device',
                device,
                message: 'New peer device detected. Future encrypted messages may be readable on that device.',
            });
            return;
        }

        if (existing.identityPublicKey !== device.identityPublicKey) {
            trustMap[key] = {
                ...existing,
                identityPublicKey: device.identityPublicKey,
                lastSeenAt: now,
                status: 'changed',
            };
            blockedDeviceIds.add(device.deviceId);
            warnings.push({
                type: 'key-changed',
                device,
                message: 'Peer device key changed. Sending to this device is blocked.',
            });
            return;
        }

        trustMap[key] = {
            ...existing,
            lastSeenAt: now,
            status: existing.status === 'changed' ? 'changed' : 'trusted',
        };

        if (trustMap[key].status === 'changed') {
            blockedDeviceIds.add(device.deviceId);
        }
    });

    Object.keys(trustMap).forEach((key) => {
        const [userId] = key.split(':');
        if (String(userId) === String(currentUserId)) return;

        if (!activeKeys.has(key) && trustMap[key].status !== 'changed') {
            trustMap[key] = {
                ...trustMap[key],
                status: 'revoked',
                lastSeenAt: now,
            };
        }
    });

    writeTrustMap(trustMap);

    return {
        warnings,
        blockedDeviceIds,
    };
};

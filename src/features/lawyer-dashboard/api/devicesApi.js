import api from '../../../services/api/axios';

export const registerCurrentDevice = (device, accessToken) =>
    api.post('/api/devices/register', device, accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined);

export const getMyDevices = () => api.get('/api/devices/me');

export const revokeDevice = (deviceId) =>
    api.post(`/api/devices/${deviceId}/revoke`);

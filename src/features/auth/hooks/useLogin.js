import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/loginApi';
import { useAuthStore } from '../store/authStore';
import { registerCurrentDevice } from '../../lawyer-dashboard/api/devicesApi';
import {
    buildRegisterDevicePayload,
    ensureLocalDeviceIdentity,
} from '../../lawyer-dashboard/e2ee/deviceIdentity';

/**
 * Login mutation hook.
 *
 * Usage:
 *   const { mutate, isPending, error } = useLogin();
 *   mutate({ email, password });
 *
 * On success → stores auth in Zustand and navigates to "/".
 * On error  → `error` holds { code, message, details? } from server.
 */
const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials) => {
            const device = await ensureLocalDeviceIdentity();
            const data = await loginApi({
                ...credentials,
                deviceId: device.deviceId,
            });

            await registerCurrentDevice(
                buildRegisterDevicePayload(device),
                data.tokens.accessToken
            );

            return data;
        },
        onSuccess: (data) => {
            if(data.user.accountStatus=="PendingReview")
                navigate('/account-status')
            else
            {
                setAuth(data);
                navigate('/');
            }
        },
    });
};

export default useLogin;

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/loginApi';
import { useAuthStore } from '../store/authStore';

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
        mutationFn: loginApi,
        onSuccess: (data) => {
            if (data.user.accountStatus == "PendingReview")
                navigate('/account-status')
            else {
                setAuth(data);
                navigate('/login');
            }
        },
    });
};

export default useLogin;

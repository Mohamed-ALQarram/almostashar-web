import { useMutation } from '@tanstack/react-query';
import { registerLawyer } from '../api/lawyerRegisterApi';
import { useLawyerRegisterStore } from '../store/lawyerRegisterStore';
import { useNavigate } from 'react-router-dom';
/**
 * Register lawyer mutation hook.
 *
 * Usage:
 *   const { mutateAsync, isPending, error } = useRegisterLawyer();
 *   const result = await mutateAsync(fullPayload);
 *
 * On success → resets the registration store.
 */
const useRegisterLawyer = () => {
    const reset = useLawyerRegisterStore((state) => state.reset);
    const navigate=  useNavigate();
    return useMutation({
        mutationFn: registerLawyer,
        onSuccess: () => {
            reset();
            navigate('/account-status')
        },
    });
};

export default useRegisterLawyer;

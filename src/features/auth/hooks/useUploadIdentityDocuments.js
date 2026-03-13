import { useMutation } from '@tanstack/react-query';
import { uploadIdentityDocuments } from '../api/lawyerRegisterApi';

/**
 * Upload identity documents mutation hook.
 *
 * Usage:
 *   const { mutateAsync, isPending, error } = useUploadIdentityDocuments();
 *   const urls = await mutateAsync({ SSN, SyndicateCard, PracticeCertificates });
 */
const useUploadIdentityDocuments = () => {
    return useMutation({
        mutationFn: uploadIdentityDocuments,
    });
};

export default useUploadIdentityDocuments;

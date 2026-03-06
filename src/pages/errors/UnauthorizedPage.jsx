import ErrorPage from '../../components/ErrorPage';

const UnauthorizedPage = () => {
    const icon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-error">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    );

    return (
        <ErrorPage
            code="403"
            title="غير مصرح بالدخول"
            description="ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم الفني."
            icon={icon}
            actions={[
                { label: 'العودة للرئيسية', to: '/', variant: 'primary' },
                { label: 'تسجيل الدخول', to: '/login', variant: 'secondary' },
            ]}
        />
    );
};

export default UnauthorizedPage;

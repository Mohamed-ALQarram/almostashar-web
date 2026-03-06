import ErrorPage from '../../components/ErrorPage';

const NotFoundPage = () => {
    const icon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-brand-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    );

    return (
        <ErrorPage
            code="404"
            title="الصفحة غير موجودة"
            description="عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون قد حُذفت أو أن الرابط غير صحيح."
            icon={icon}
            actions={[
                { label: 'العودة للرئيسية', to: '/', variant: 'primary' },
            ]}
        />
    );
};

export default NotFoundPage;

import { useLocation } from 'react-router-dom';
import ErrorPage from '../../components/ErrorPage';

const ServerErrorPage = () => {
    const location = useLocation();
    const errorMessage = location.state?.message || null;

    const icon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-error">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-13.5 0a3 3 0 0 1-3-3m3 3h13.5m-13.5 0a3 3 0 0 0-3 3m18 0a3 3 0 0 0-3-3m3 3a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3m18 0a3 3 0 0 0-3-3m3-6a3 3 0 0 0-3-3H6.75a3 3 0 0 0-3 3m18 0a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3m18 0V6A3 3 0 0 0 18.75 3H5.25A3 3 0 0 0 2.25 6v.75" />
        </svg>
    );

    return (
        <ErrorPage
            code="500"
            title="خطأ في الخادم"
            description="حدث خطأ غير متوقع في الخادم. فريقنا التقني يعمل على حل المشكلة. يرجى المحاولة لاحقاً."
            icon={icon}
            errorMessage={errorMessage}
            actions={[
                { label: 'إعادة المحاولة', to: '/', variant: 'primary' },
            ]}
        />
    );
};

export default ServerErrorPage;


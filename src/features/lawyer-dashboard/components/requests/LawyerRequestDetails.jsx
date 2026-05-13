import React from 'react';
import usePresignedUrl from '../../hooks/usePresignedUrl';

const DocumentItem = ({ doc }) => {
    const { url: actualUrl, isLoading } = usePresignedUrl(doc.documentUrl);

    const Container = actualUrl ? 'a' : 'div';
    const containerProps = actualUrl ? {
        href: actualUrl,
        target: '_blank',
        rel: 'noopener noreferrer'
    } : {};

    return (
        <Container
            {...containerProps}
            className={`flex items-center gap-4 p-4 border border-gray-100 rounded-xl transition-colors ${actualUrl ? 'cursor-pointer hover:bg-gray-50' : ''} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
        >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.documentName?.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-500'}`}>
                {isLoading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-800">{doc.documentName || `مرفق`}</h4>
                <p className="text-xs text-gray-400 mt-1" dir="ltr">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('ar-SA') : ''}
                </p>
            </div>
        </Container>
    );
};

const LawyerRequestDetails = ({ request, onBack, actions, isLoadingActions }) => {
    if (!request) return null;

    const {
        title,
        problemDetails,
        createdAt,
        clientName,
        clientProfileImage,
        location,
        status, // Enum value, e.g. 0 = Pending, etc. (We will just say "قيد المراجعة" for now if not processed)
        documents = [],
        clientCompany = 'عميل فردي' // Fallback if no company info
    } = request;

    // Formatting date (e.g. 12 أكتوبر 2023)
    const formattedDate = new Date(createdAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const locationText = location ? `${location.city || ''}، ${location.governorate || ''}`.replace(/^، |، $/g, '') : 'غير محدد';

    return (
        <div className="animate-fade-in" dir="rtl">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>العودة إلى الطلبات</span>
            </button>

            {/* Header Info */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{title || 'طلب بدون عنوان'}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formattedDate}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{locationText || 'المملكة العربية السعودية'}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-bold">
                        قيد المراجعة
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content (Right Column) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            وصف الطلب
                        </h3>
                        <div className="w-full h-px bg-gray-100 mb-4" />
                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                            {problemDetails || 'لم يتم تقديم تفاصيل للمشكلة.'}
                        </p>
                    </div>

                    {/* Attached Documents Card */}
                    {documents && documents.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                المستندات المرفقة
                            </h3>
                            <div className="space-y-3">
                                {documents.map((doc, idx) => (
                                    <DocumentItem key={doc.id || idx} doc={doc} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Left Column) */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden mb-4 bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold">
                            {clientProfileImage ? (
                                <img src={clientProfileImage} alt={clientName} className="w-full h-full object-cover" />
                            ) : (
                                <span>{clientName ? clientName.charAt(0) : 'ع'}</span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{clientName || 'عميل'}</h2>
                        <p className="text-sm text-gray-500 mt-1">{clientCompany}</p>
                    </div>

                    {/* Action Buttons */}
                    {actions && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
                            {isLoadingActions && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                    <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                            <h3 className="text-sm font-bold text-gray-500 mb-4 text-right">الإجراء المطلوب</h3>
                            <div className="space-y-3 flex flex-col items-stretch w-full">
                                {actions}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LawyerRequestDetails;

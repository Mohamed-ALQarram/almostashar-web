import React from 'react';
import { usePresignedUrl } from '../../../documents';

const ServiceDetailsCard = ({ serviceType, details }) => {
    if (!details) return null;

    const DetailRow = ({ label, value }) => (
        <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100/80">
            <span className="text-xs text-gray-500 mb-1">{label}</span>
            <span className="text-sm font-semibold text-gray-900">{value || 'غير محدد'}</span>
        </div>
    );

    const BooleanRow = ({ label, value }) => (
        <DetailRow label={label} value={value ? 'نعم' : 'لا'} />
    );

    const DateRow = ({ label, value }) => {
        const formatted = value ? new Date(value).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير محدد';
        return <DetailRow label={label} value={formatted} />
    };

    let content = null;

    switch (serviceType) {
        case 'Consultation':
        case 0:
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="الفرع القانوني" value={details.legalBranch} />
                    <DateRow label="الموعد المفضل" value={details.preferredAppointmentDate} />
                    <DetailRow label="طريقة التواصل" value={details.communicationMethod} />
                    <div className="md:col-span-2">
                        <DetailRow label="ملخص الاستشارة" value={details.consultationSummary} />
                    </div>
                </div>
            );
            break;
        case 'Contract':
        case 1:
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="نوع العقد" value={details.contractType} />
                    <DetailRow label="نوع طلب العقد" value={details.contractRequestType} />
                    <DetailRow label="اللغة" value={details.language} />
                    <DetailRow label="عدد الصفحات" value={details.pagesCount} />
                    <DetailRow label="المراجعات المسموحة" value={details.allowedRevisions} />
                    <DateRow label="تاريخ التسليم" value={details.deliveryDate} />
                    <div className="md:col-span-2">
                        <DetailRow label="اسم الطرف الآخر" value={details.otherPartyName} />
                    </div>
                </div>
            );
            break;
        case 'Company Formation':
        case 2:
        case 'CompanyFormation':
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="نوع الشركة" value={details.companyType} />
                    <DetailRow label="مبلغ رأس المال" value={details.capitalAmount} />
                    <DetailRow label="عدد المؤسسين" value={details.foundersCount} />
                    <BooleanRow label="لديه وكالة" value={details.hasPowerOfAttorney} />
                    <div className="md:col-span-2">
                        <DetailRow label="الاسم المقترح للشركة" value={details.proposedCompanyName} />
                    </div>
                    <div className="md:col-span-2">
                        <DetailRow label="النشاط التجاري" value={details.businessActivity} />
                    </div>
                </div>
            );
            break;
        case 'Lawsuit':
        case 3:
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="الفرع القانوني" value={details.legalBranch} />
                    <BooleanRow label="هل القضية مرفوعة بالفعل؟" value={details.isCaseAlreadyFiled} />
                    {details.isCaseAlreadyFiled && (
                        <>
                            <DetailRow label="اسم المحكمة" value={details.courtName} />
                            <DetailRow label="رقم القضية" value={details.caseNumber} />
                            <DateRow label="تاريخ الجلسة القادمة" value={details.nextHearingDate} />
                            <DetailRow label="حالة القضية" value={details.lawsuitStatus} />
                            <DetailRow label="دور العميل" value={details.clientRole} />
                            <DetailRow label="اسم الخصم" value={details.opponentName} />
                        </>
                    )}
                </div>
            );
            break;
        default:
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="الفرع القانوني" value={details.legalBranch} />
                    <div className="md:col-span-2 space-y-3">
                        <DetailRow label="الملخص" value={details.summary} />
                        <DetailRow label="النتيجة المرجوة" value={details.desiredOutcome} />
                        <DetailRow label="تواريخ هامة" value={details.importantDates} />
                    </div>
                </div>
            );
            break;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                تفاصيل الخدمة المطلوبة
            </h3>
            <div className="w-full h-px bg-gray-100 mb-4" />
            {content}
        </div>
    );
};

const DocumentItem = ({ doc }) => {
    const { data, isLoading } = usePresignedUrl(doc.id);
    const actualUrl = data?.url;

    const Container = actualUrl ? 'a' : 'div';
    const containerProps = actualUrl ? {
        href: actualUrl,
        target: '_blank',
        rel: 'noopener noreferrer'
    } : {};

    const formatBytes = (bytes) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const isPdf = doc.documentName?.toLowerCase().endsWith('.pdf') || doc.type === 'application/pdf';
    const isImage = doc.type?.startsWith('image/') || doc.documentName?.match(/\.(jpeg|jpg|gif|png)$/i) != null;

    let iconBgClass = 'bg-gray-50 text-gray-500';
    let Icon = null;

    if (isPdf) {
        iconBgClass = 'bg-red-50 text-red-500';
        Icon = (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        );
    } else if (isImage) {
        iconBgClass = 'bg-blue-50 text-blue-500';
        Icon = (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        );
    } else {
        iconBgClass = 'bg-yellow-50 text-yellow-600';
        Icon = (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    }

    return (
        <Container
            {...containerProps}
            className={`flex items-center gap-4 p-4 border border-gray-100 rounded-xl transition-all duration-200 hover:shadow-md ${actualUrl ? 'cursor-pointer hover:bg-gray-50' : ''} ${isLoading && !actualUrl ? 'opacity-70 pointer-events-none' : ''}`}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
                {isLoading && !actualUrl ? (
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    Icon
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate" title={doc.documentName}>{doc.documentName || 'مرفق'}</h4>
                <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mt-1.5">
                    {doc.sizeInBytes && (
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                            {formatBytes(doc.sizeInBytes)}
                        </span>
                    )}
                    {doc.type && (
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[120px]" title={doc.type}>
                            {doc.type.split('/')[1]?.toUpperCase() || doc.type}
                        </span>
                    )}
                    {(doc.createdAt || doc.expiresAt) && (
                        <span className="text-gray-400 font-medium" dir="ltr">
                            {new Date(doc.createdAt || doc.expiresAt).toLocaleDateString('ar-SA')}
                        </span>
                    )}
                </div>
            </div>

            {/* View/Download icon */}
            {actualUrl && (
                <div className="flex-shrink-0 text-gray-300 hover:text-primary transition-colors bg-white rounded-full p-2 border border-gray-100 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
            )}
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
        clientCompany = 'عميل فردي', // Fallback if no company info
        serviceType,
        requestDetails
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

                    {/* Dynamic Service Details */}
                    <ServiceDetailsCard serviceType={serviceType} details={requestDetails} />

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

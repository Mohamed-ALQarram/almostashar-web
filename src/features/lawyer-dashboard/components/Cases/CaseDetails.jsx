import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseDetails } from '../../hooks/useLawyerCases';
import { usePresignedUrl } from '../../../documents';
import {
    ArrowRight, Calendar, User, Globe, MessageCircle, Hash,
    FileText, Clock, StickyNote, Paperclip, Scale, Building2,
    Gavel, Video, Phone, Globe2, RotateCcw, Truck, Users,
    BadgeDollarSign, Shield, BookOpen
} from 'lucide-react';

// ─── Status Config (reused from CaseCard) ───────────────────────────
const statusConfig = {
    Open: { label: 'مفتوحة', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    InProgress: { label: 'جاري العمل', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    Closed: { label: 'مكتملة', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
    Dismissed: { label: 'مرفوضة', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
    OnHold: { label: 'معلقة', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500' },
    Canceled: { label: 'ملغاة', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-600' },
    PendingConfirmation: { label: 'بانتظار التأكيد', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
};

const serviceTypeLabels = {
    Consultation: 'استشارة قانونية',
    Contract: 'صياغة العقد',
    CompanyFormation: 'تأسيس الشركة',
    Lawsuit: 'الدعوى القضائية',
};

const serviceTypeIcons = {
    Consultation: <BookOpen className="w-6 h-6 text-primary" />,
    Contract: <FileText className="w-6 h-6 text-primary" />,
    CompanyFormation: <Building2 className="w-6 h-6 text-primary" />,
    Lawsuit: <Gavel className="w-6 h-6 text-primary" />,
};

const communicationLabels = {
    Video: 'مكالمة فيديو',
    Audio: 'مكالمة صوتية',
    Chat: 'محادثة نصية',
    InPerson: 'حضوري',
};

const lawsuitStatusLabels = {
    Active: 'نشطة',
    Pending: 'معلقة',
    Closed: 'مغلقة',
};

const clientRoleLabels = {
    Plaintiff: 'مدعي',
    Defendant: 'مدعى عليه',
};

const companyTypeLabels = {
    SoleProprietorship: 'مؤسسة فردية',
    LLC: 'شركة ذات مسؤولية محدودة',
    Partnership: 'شركة تضامن',
    JointStock: 'شركة مساهمة',
    LimitedPartnership: 'شركة توصية بسيطة',
};

const contractTypeLabels = {
    Settlement: 'عقد تسوية',
    Employment: 'عقد عمل',
    Sales: 'عقد بيع',
    Lease: 'عقد إيجار',
    Partnership: 'عقد شراكة',
    Service: 'عقد خدمات',
    NDA: 'اتفاقية عدم إفصاح',
};

// ─── Date Helpers ───────────────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return 'غير محدد';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return 'غير محدد';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

// ─── Reusable Detail Row ────────────────────────────────────────────
const DetailRow = ({ icon: Icon, label, value }) => {
    if (value === null || value === undefined) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4.5 h-4.5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

// ─── Service-Specific Details ───────────────────────────────────────
const ConsultationDetails = ({ data }) => (
    <>
        <DetailRow icon={Calendar} label="موعد الاستشارة" value={formatDate(data.appointmentDate)} />
        <DetailRow icon={Video} label="طريقة التواصل" value={communicationLabels[data.communicationMethod] || data.communicationMethod} />
        <DetailRow icon={Scale} label="الفرع القانوني" value={data.legalBranch} />
    </>
);

const LawsuitDetails = ({ data }) => (
    <>
        <DetailRow icon={Building2} label="المحكمة المختصة" value={data.courtName} />
        <DetailRow icon={Hash} label="رقم القضية لدى المحكمة" value={data.caseNumber} />
        <DetailRow icon={Calendar} label="تاريخ الجلسة القادمة" value={formatDate(data.nextHearingDate)} />
        <DetailRow icon={Shield} label="حالة القضية" value={lawsuitStatusLabels[data.lawsuitStatus] || data.lawsuitStatus} />
        <DetailRow icon={User} label="صفة الموكل" value={clientRoleLabels[data.clientRole] || data.clientRole} />
    </>
);

const CompanyFormationDetails = ({ data }) => (
    <>
        <DetailRow icon={Building2} label="نوع الشركة" value={companyTypeLabels[data.companyType] || data.companyType} />
        <DetailRow icon={BadgeDollarSign} label="رأس المال المدفوع" value={data.capitalAmount != null ? `${data.capitalAmount.toLocaleString('ar-EG')} ر.س` : null} />
        <DetailRow icon={Users} label="عدد المؤسسين" value={data.foundersCount != null ? `${data.foundersCount} مؤسسين` : null} />
        <DetailRow icon={Shield} label="توكيل قضايا" value={data.hasPowerOfAttorney != null ? (data.hasPowerOfAttorney ? 'نعم' : 'لا') : null} />
    </>
);

const ContractDetails = ({ data }) => (
    <>
        <DetailRow icon={FileText} label="نوع العقد" value={contractTypeLabels[data.contractType] || data.contractType} />
        <DetailRow icon={Globe2} label="لغة الصياغة" value={data.language} />
        <DetailRow icon={RotateCcw} label="عدد المراجعات المسموح بها" value={data.allowedRevisions != null ? `${data.allowedRevisions} مراجعات` : null} />
        <DetailRow icon={Truck} label="تاريخ التسليم" value={formatDate(data.deliveryDate)} />
    </>
);

const serviceDetailsComponents = {
    Consultation: ConsultationDetails,
    Lawsuit: LawsuitDetails,
    CompanyFormation: CompanyFormationDetails,
    Contract: ContractDetails,
};

// ─── Document Item with presigned URL ───────────────────────────────
const DocumentItem = ({ doc }) => {
    const { data: presigned, isLoading } = usePresignedUrl(doc.id);
    const actualUrl = presigned?.url;

    const isPdf = doc.documentName?.toLowerCase().endsWith('.pdf');
    const isImage = doc.documentName?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    let iconBg = 'bg-yellow-50 text-yellow-600';
    if (isPdf) iconBg = 'bg-red-50 text-red-500';
    else if (isImage) iconBg = 'bg-blue-50 text-blue-500';

    const Container = actualUrl ? 'a' : 'div';
    const containerProps = actualUrl
        ? { href: actualUrl, target: '_blank', rel: 'noopener noreferrer' }
        : {};

    return (
        <Container
            {...containerProps}
            className={`flex items-center gap-4 p-4 border border-gray-100 rounded-xl transition-all duration-200 hover:shadow-md ${actualUrl ? 'cursor-pointer hover:bg-gray-50' : ''} ${isLoading ? 'opacity-70' : ''}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                {isLoading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <Paperclip className="w-5 h-5" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate">{doc.documentName || 'مرفق'}</h4>
                <p className="text-xs text-gray-400 mt-1">
                    {formatDate(doc.createdAt)}
                </p>
            </div>
        </Container>
    );
};

// ─── Notes Item ─────────────────────────────────────────────────────
const NoteItem = ({ note }) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDateTime(note.createdAt)}
        </p>
    </div>
);

// ─── Detail Tabs ────────────────────────────────────────────────────
const DETAIL_TABS = [
    { key: 'details', label: 'التفاصيل', icon: FileText },
    { key: 'documents', label: 'المستندات', icon: Paperclip },
    { key: 'timeline', label: 'الجدول الزمني', icon: Clock },
    { key: 'notes', label: 'الملاحظات', icon: StickyNote },
];

// ─── Loading Skeleton ───────────────────────────────────────────────
const DetailsSkeleton = () => (
    <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-gray-100 rounded" />
                    <div className="h-4 w-32 bg-gray-50 rounded" />
                </div>
                <div className="h-7 w-24 bg-gray-100 rounded-full" />
            </div>
        </div>
        {/* Tabs skeleton */}
        <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 bg-gray-100 rounded-lg" />)}
        </div>
        {/* Content skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-20 bg-gray-50 rounded" />
                        <div className="h-4 w-36 bg-gray-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── Main CaseDetails Component ─────────────────────────────────────
const CaseDetails = ({ caseId, onBack }) => {
    const [activeTab, setActiveTab] = useState('details');
    const navigate = useNavigate();
    const { data: caseData, isLoading, isError } = useCaseDetails(caseId);

    const handleMessageClient = () => {
        if (!caseData?.chatId) return;
        navigate('/lawyer-dashboard/chats', {
            state: {
                selectedChat: {
                    chatId: caseData.chatId,
                    userId: null, // Will be resolved by the chat page
                    fullName: caseData.clientName,
                    profileImage: null,
                    caseType: caseData.serviceType,
                },
            },
        });
    };

    if (isLoading) {
        return (
            <div dir="rtl">
                <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                    <span>العودة إلى القضايا</span>
                </button>
                <DetailsSkeleton />
            </div>
        );
    }

    if (isError || !caseData) {
        return (
            <div dir="rtl">
                <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                    <span>العودة إلى القضايا</span>
                </button>
                <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100">
                    <h3 className="text-lg font-semibold text-red-600 mb-1">حدث خطأ</h3>
                    <p className="text-sm text-red-400">تعذر تحميل تفاصيل القضية.</p>
                </div>
            </div>
        );
    }

    const status = statusConfig[caseData.status] || statusConfig.Open;
    const ServiceDetails = serviceDetailsComponents[caseData.serviceType];

    return (
        <div className="animate-fadeIn" dir="rtl">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors"
            >
                <ArrowRight className="w-5 h-5" />
                <span>العودة إلى القضايا</span>
            </button>

            {/* ── Case Header Card ── */}
            <div className="bg-primary rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                            {serviceTypeIcons[caseData.serviceType] || <FileText className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                            <h1 className="text-lg lg:text-xl font-bold leading-relaxed">
                                {caseData.title}
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5 text-white/60 text-sm">
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    العميل: {caseData.clientName}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                        </span>
                        <span className="text-xs text-white/40 font-mono" dir="ltr">
                            {caseData.reference}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
                {DETAIL_TABS.map((tab) => {
                    const TabIcon = tab.icon;
                    const count = tab.key === 'documents' ? caseData.documents?.length
                        : tab.key === 'notes' ? caseData.notes?.length
                            : tab.key === 'timeline' ? caseData.timelines?.length
                                : null;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.key
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            {tab.label}
                            {count > 0 && (
                                <span className="bg-gold/10 text-gold text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Tab Content ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content — 2 cols */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ────── Details Tab ────── */}
                    {activeTab === 'details' && (
                        <>
                            {/* Service-specific details */}
                            {ServiceDetails && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        {serviceTypeIcons[caseData.serviceType]}
                                        تفاصيل {serviceTypeLabels[caseData.serviceType] || 'الخدمة'}
                                    </h3>
                                    <div className="w-full h-px bg-gray-100 mb-2" />
                                    <ServiceDetails data={caseData} />
                                </div>
                            )}

                            {/* Case description */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    وصف القضية
                                </h3>
                                <div className="w-full h-px bg-gray-100 mb-4" />
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {caseData.description || 'لم يتم إضافة وصف.'}
                                </p>
                            </div>

                            {/* Cancellation reason (if canceled) */}
                            {caseData.status === 'Canceled' && caseData.cancellationReason && (
                                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-red-700 mb-0.5">سبب الإلغاء</p>
                                        <p className="text-sm text-red-600">{caseData.cancellationReason}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ────── Documents Tab ────── */}
                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-gray-400" />
                                المستندات المرفقة
                            </h3>
                            <div className="w-full h-px bg-gray-100 mb-4" />
                            {caseData.documents?.length > 0 ? (
                                <div className="space-y-3">
                                    {caseData.documents.map((doc) => (
                                        <DocumentItem key={doc.id} doc={doc} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Paperclip className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm text-gray-400">لا توجد مستندات مرفقة</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ────── Timeline Tab ────── */}
                    {activeTab === 'timeline' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                الجدول الزمني
                            </h3>
                            <div className="w-full h-px bg-gray-100 mb-4" />
                            {caseData.timelines?.length > 0 ? (
                                <div className="relative pr-6 space-y-6">
                                    {/* Vertical line */}
                                    <div className="absolute right-2 top-2 bottom-2 w-0.5 bg-gray-100" />
                                    {caseData.timelines.map((entry, i) => (
                                        <div key={i} className="relative flex gap-4">
                                            <div className="absolute right-[-14px] top-1 w-3 h-3 rounded-full bg-gold border-2 border-white shadow-sm z-10" />
                                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800">{entry.title || entry.content}</p>
                                                {entry.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{entry.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDateTime(entry.createdAt || entry.date)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Clock className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm text-gray-400">لم يتم إضافة أحداث بعد</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ────── Notes Tab ────── */}
                    {activeTab === 'notes' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <StickyNote className="w-5 h-5 text-gray-400" />
                                الملاحظات
                            </h3>
                            <div className="w-full h-px bg-gray-100 mb-4" />
                            {caseData.notes?.length > 0 ? (
                                <div className="space-y-3">
                                    {caseData.notes.map((note) => (
                                        <NoteItem key={note.id} note={note} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <StickyNote className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm text-gray-400">لم يتم إضافة ملاحظات بعد</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Sidebar (Right Column) ── */}
                <div className="space-y-6">
                    {/* Quick Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-500 mb-4">معلومات القضية</h3>
                        <div className="space-y-0">
                            <DetailRow icon={Calendar} label="تاريخ الإنشاء" value={formatDate(caseData.createdAt)} />
                            <DetailRow icon={User} label="العميل" value={caseData.clientName} />
                            <DetailRow icon={Globe} label="المصدر" value={caseData.source === 'Platform' ? 'المنصة' : caseData.source} />
                            <DetailRow icon={Hash} label="رقم الطلب" value={caseData.clientRequestReference} />
                        </div>
                    </div>

                    {/* Message Client Button */}
                    {caseData.chatId && (
                        <button
                            onClick={handleMessageClient}
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gold hover:bg-gold/5 text-gray-700 hover:text-gold-dark py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200"
                        >
                            <MessageCircle className="w-5 h-5" />
                            مراسلة العميل
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;

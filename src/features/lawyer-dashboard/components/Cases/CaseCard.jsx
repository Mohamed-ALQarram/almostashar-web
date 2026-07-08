import React from 'react';
import { MessageCircle, Eye, Globe, Calendar, User } from 'lucide-react';

// ─── Status Config ──────────────────────────────────────────────────
const statusConfig = {
    Open: {
        label: 'مفتوحة',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
    InProgress: {
        label: 'جاري العمل',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
    },
    Closed: {
        label: 'مكتملة',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200',
        dot: 'bg-gray-400',
    },
    Dismissed: {
        label: 'مرفوضة',
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
    OnHold: {
        label: 'معلقة',
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
    },
    Canceled: {
        label: 'ملغاة',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-300',
        dot: 'bg-red-600',
    },
    PendingConfirmation: {
        label: 'بانتظار التأكيد',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
};

const serviceTypeLabels = {
    Consultation: 'استشارة قانونية',
    Contract: 'عقد',
    CompanyFormation: 'تأسيس شركة',
    Lawsuit: 'قضية',
};

const serviceTypeIcons = {
    Consultation: (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            </svg>
        </div>
    ),
    Contract: (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v7h6v9H6z" />
            </svg>
        </div>
    ),
    CompanyFormation: (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        </div>
    ),
    Lawsuit: (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
        </div>
    ),
};

const sourceLabels = {
    Platform: 'المنصة',
    External: 'خارجي',
    Direct: 'مباشر',
};

// ─── Date formatter ─────────────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ─── CaseCard Component ─────────────────────────────────────────────
const CaseCard = ({ caseItem, onMessageClient, onViewDetails }) => {
    const status = statusConfig[caseItem.status] || statusConfig.Open;
    const unread = caseItem.chat?.unreadMessagesCount || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 hover:border-gold/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            {/* Card Header — Service type + Status */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    {serviceTypeIcons[caseItem.serviceType] || serviceTypeIcons.Consultation}
                    <span className="text-sm font-semibold text-gray-700">
                        {serviceTypeLabels[caseItem.serviceType] || caseItem.serviceType}
                    </span>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </div>

            {/* Card Body */}
            <div className="px-5 pb-4">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base mb-1.5 leading-relaxed line-clamp-1">
                    {caseItem.title}
                </h3>

                {/* Description */}
                {caseItem.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {caseItem.description}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(caseItem.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {caseItem.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        {sourceLabels[caseItem.source] || caseItem.source}
                    </span>
                </div>

                {/* Cancellation Reason */}
                {caseItem.status === 'Canceled' && caseItem.cancellationReason && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mt-3">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-red-600 leading-relaxed">
                            <span className="font-semibold">سبب الإلغاء:</span> {caseItem.cancellationReason}
                        </p>
                    </div>
                )}
            </div>

            {/* Card Footer — Actions */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-t border-gray-50 bg-gray-50/50">
                {/* Message Client Button */}
                {caseItem.chat && (
                    <button
                        onClick={() => onMessageClient(caseItem)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gold hover:bg-gold/5 text-gray-700 hover:text-gold-dark py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    >
                        <div className="relative">
                            <MessageCircle className="w-4 h-4" />
                            {unread > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-gold text-white text-[10px] font-bold rounded-full px-1 leading-none">
                                    {unread}
                                </span>
                            )}
                        </div>
                        <span>مراسلة العميل</span>
                    </button>
                )}

                {/* View Details Button */}
                <button
                    onClick={() => onViewDetails(caseItem)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 text-gray-600 hover:text-primary py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200"
                >
                    <Eye className="w-4 h-4" />
                    <span>عرض التفاصيل</span>
                </button>
            </div>
        </div>
    );
};

export default CaseCard;

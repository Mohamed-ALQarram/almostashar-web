import React, { useState } from 'react';
import DocumentPreviewModal from './DocumentPreviewModal';

const ReviewLawyerModal = ({ lawyer, onClose, onReview, isAccepting, isRejecting }) => {
    const [previewDoc, setPreviewDoc] = useState(null);

    if (!lawyer) return null;

    // Helper: format ISO date
    const formatDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    };

    // Helper: validate document path
    const hasDoc = (path) => path && path !== 'string';

    const documents = [
        { id: 'syndicate', label: 'كارنيه النقابة', path: lawyer.syndicateCardUrl },
        { id: 'ssn', label: 'البطاقة الشخصية', path: lawyer.ssN_Url },
        { id: 'practice', label: 'شهادة مزاولة المهنة', path: lawyer.practiceCertificatesUrl },
    ];

    const isProcessing = isAccepting || isRejecting;

    return (
        <>
            {/* Main Review Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-primary text-white">
                        <h3 className="text-lg font-bold">مراجعة طلب التسجيل</h3>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">

                        {/* Lawyer Info Header */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                                {lawyer.fullName ? lawyer.fullName.charAt(0) : 'م'}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-primary mb-1">{lawyer.fullName}</h4>
                                <p className="text-sm text-brand-muted">
                                    {/* Placeholder for actual specialty/experience if available in the future.  
                                        The design shows "القانون الجنائي • 10 سنوات", using fallback. */}
                                    {lawyer.specialty || 'محامٍ'} • {lawyer.governorate || 'غير محدد'}
                                </p>
                            </div>
                        </div>

                        {/* Detail Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-end text-right">
                                <span className="text-xs text-brand-muted mb-1">تاريخ التقديم</span>
                                <span className="font-bold text-gray-900">{formatDate(lawyer.createdAt)}</span>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-end text-right">
                                <span className="text-xs text-brand-muted mb-1">رقم القيد بالنقابة</span>
                                <span className="font-bold text-gray-900" dir="ltr">{lawyer.syndicateId}</span>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="flex flex-col gap-3 mt-2">
                            <h5 className="font-bold text-primary text-right">المستندات المرفقة</h5>

                            <div className="flex flex-col gap-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center justify-between p-3 rounded-xl border ${hasDoc(doc.path) ? 'bg-success/5 border-success/20' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Document Icon */}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasDoc(doc.path) ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-semibold">{doc.label}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {hasDoc(doc.path) ? (
                                                <>
                                                    <span className="flex items-center gap-1 text-sm text-success font-medium">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                        مرفق
                                                    </span>
                                                    <button
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
                                                    >
                                                        عرض المستند
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400">غير مرفق</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                        <button
                            onClick={() => onReview(true)}
                            disabled={isProcessing}
                            className="flex-1 py-3 bg-success hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isAccepting ? (
                                <span className="flex items-center gap-2">جاري القبول...</span>
                            ) : (
                                <>
                                    موافقة
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => onReview(false)}
                            disabled={isProcessing}
                            className="flex-1 py-3 bg-error hover:bg-red-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isRejecting ? (
                                <span className="flex items-center gap-2">جاري الرفض...</span>
                            ) : (
                                <>
                                    رفض
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Preview Portal */}
            {previewDoc && (
                <DocumentPreviewModal
                    title={previewDoc.label}
                    filePath={previewDoc.path}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </>
    );
};

export default ReviewLawyerModal;

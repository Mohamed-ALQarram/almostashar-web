import React, { useState } from 'react';
import { useUnverifiedLawyers, useVerifyLawyer } from '../hooks/useAdminVerification';
import ReviewLawyerModal from './ReviewLawyerModal';

const VerificationRequestsTable = () => {
    const { data: lawyers, isLoading, isError } = useUnverifiedLawyers();
    const verifyMutation = useVerifyLawyer();
    const [reviewingLawyer, setReviewingLawyer] = useState(null);

    // 1. Add a state to track the current action type ('accept' or 'reject')
    const [actionType, setActionType] = useState(null);

    const handleReview = (isAccepted) => {
        if (!reviewingLawyer) return;

        // Set the action type before starting the mutation
        setActionType(isAccepted);

        // 2. Pass variables as an object to match the mutationFn
        verifyMutation.mutate({
            lawyerId: reviewingLawyer.id,
            isAccepted: isAccepted
        }, {
            onSettled: () => {
                setReviewingLawyer(null);
                // Optional: reset actionType here if you want to clear messages after a timeout
            },
        });
    };
    // ── Loading skeleton ──────────────────────────────────────────
    if (isLoading) {
        return <div className="h-96 bg-white rounded-2xl shadow-sm animate-pulse mb-8"></div>;
    }

    // ── Error state ───────────────────────────────────────────────
    if (isError) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center mb-8" dir="rtl">
                <p className="text-error font-medium">حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة لاحقاً.</p>
            </div>
        );
    }

    const requests = lawyers ?? [];

    // Helper: get Arabic initial from fullName
    const getInitial = (name) => (name ? name.charAt(0) : '؟');

    // Helper: format ISO date to readable Arabic-friendly format
    const formatDate = (iso) => {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Helper: derive document status from URL fields
    const getDocumentStatuses = (lawyer) => [
        { label: 'الرقم القومي', ok: !!lawyer.ssN_Url && lawyer.ssN_Url !== 'string' },
        { label: 'كارنيه النقابة', ok: !!lawyer.syndicateCardUrl && lawyer.syndicateCardUrl !== 'string' },
        { label: 'شهادة الممارسة', ok: !!lawyer.practiceCertificatesUrl && lawyer.practiceCertificatesUrl !== 'string' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 overflow-hidden mb-8" dir="rtl">
            {/* Header & Controls */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-lg text-primary">طلبات التسجيل الجديدة</h2>
                    <span className="px-3 py-1 bg-gold text-white text-xs font-bold rounded-full">
                        {requests.length} طلبات
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        تصفية
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        تصدير
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                </div>
            </div>

            {/* Success toast (Dynamic message based on actionType) */}
            {verifyMutation.isSuccess && (
                <div className="mx-5 mt-4 p-3 bg-success/10 border border-success/20 text-success text-sm font-medium rounded-lg text-center">
                    {actionType ? 'تم قبول حساب المحامي بنجاح' : 'تم رفض حساب المحامي بنجاح'}
                </div>
            )}

            {/* Error toast (Dynamic message based on actionType) */}
            {verifyMutation.isError && (
                <div className="mx-5 mt-4 p-3 bg-error/10 border border-error/20 text-error text-sm font-medium rounded-lg text-center">
                    {actionType ? 'حدث خطأ أثناء محاولة القبول. يرجى المحاولة مرة أخرى.' : 'حدث خطأ أثناء محاولة الرفض. يرجى المحاولة مرة أخرى.'}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-sm font-medium text-white bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-4 rounded-tr-lg">المحامي</th>
                            <th scope="col" className="px-6 py-4">رقم الهاتف</th>
                            <th scope="col" className="px-6 py-4 text-center">المستندات</th>
                            <th scope="col" className="px-6 py-4">التاريخ</th>
                            <th scope="col" className="px-6 py-4 text-center rounded-tl-lg">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.map((request) => {
                            const docs = getDocumentStatuses(request);
                            const isBeingReviewed = reviewingLawyer?.id === request.id;

                            return (
                                <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar initials */}
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg border border-blue-100">
                                                {getInitial(request.fullName)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{request.fullName}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">رقم القيد: {request.syndicateId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-700" dir="ltr">
                                        {request.phoneNo}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            {docs.map((doc, i) => (
                                                <span
                                                    key={i}
                                                    title={doc.label}
                                                    className={`flex items-center justify-center w-5 h-5 rounded-sm ${doc.ok ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}
                                                >
                                                    {doc.ok ? (
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-gray-500 text-sm">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => setReviewingLawyer(request)}
                                            className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                                        >
                                            مراجعة
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">لا توجد طلبات تسجيل جديدة</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
                <span>عرض {requests.length} طلبات</span>
            </div>

            {/* Review Modal */}
            <ReviewLawyerModal
                lawyer={reviewingLawyer}
                onClose={() => setReviewingLawyer(null)}
                onReview={handleReview}
                isAccepting={verifyMutation.isPending && actionType}
                isRejecting={verifyMutation.isPending && !actionType}
            />
        </div>
    );
};

export default VerificationRequestsTable;

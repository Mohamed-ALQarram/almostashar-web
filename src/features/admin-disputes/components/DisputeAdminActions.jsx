import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// DisputeAdminActions — Left sidebar: admin actions + financial info
// ═══════════════════════════════════════════════════════════════════
const DisputeAdminActions = ({
    dispute,
    onResolve,
    isResolving,
}) => {
    const { financials } = dispute;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resolutionType, setResolutionType] = useState(''); // 'ReleaseToLawyer', 'RefundToClient', 'Dismiss'
    const [adminDecision, setAdminDecision] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    // Toast state
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

    const isResolvedStatus = ['Dismissed', 'ResolvedRefund', 'ResolvedRelease'].includes(dispute.status);

    // ── Currency formatter ──────────────────────────────────────
    const formatCurrency = (amount, currency) =>
        `${currency} ${amount.toFixed(2)}`;

    // ── Handlers ───────────────────────────────────────────────
    const handleOpenModal = (type) => {
        setResolutionType(type);
        setAdminDecision('');
        setAdminNotes('');
        setIsModalOpen(true);
    };

    const handleConfirmResolve = async () => {
        if (!adminDecision.trim()) return;
        try {
            const res = await onResolve({
                resolutionType,
                adminDecision,
                adminNotes,
            });
            setToast({ type: 'success', message: typeof res === 'string' ? res : 'Dispute resolved successfully.' });
            setIsModalOpen(false);
        } catch (err) {
            setToast({ type: 'error', message: err?.message || 'حدث خطأ أثناء تنفيذ الإجراء' });
        }
        
        // Auto-dismiss toast
        setTimeout(() => setToast(null), 3000);
    };

    const handleCloseModal = () => {
        if (isResolving) return;
        setIsModalOpen(false);
    };

    // ── Spinner used inside buttons ─────────────────────────────
    const Spinner = () => (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 relative" dir="rtl">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="font-bold text-lg text-primary">إجراءات الإدارة</h2>
            </div>

            {/* ── Action Buttons ───────────────────────────────── */}
            <div className="p-5 flex flex-col gap-3">

                {/* Side-by-side: Release to Lawyer + Refund Client */}
                <div className="flex gap-3">
                    {/* Release to Lawyer */}
                    <button
                        type="button"
                        onClick={() => handleOpenModal('ReleaseToLawyer')}
                        disabled={isResolving || isResolvedStatus}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 border font-bold rounded-xl transition-colors disabled:cursor-not-allowed ${
                            isResolvedStatus 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                            : 'bg-white border-gray-200 text-primary hover:bg-gray-50 disabled:opacity-50'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">تحويل للمستشار</span>
                    </button>

                    {/* Refund Client */}
                    <button
                        type="button"
                        onClick={() => handleOpenModal('RefundToClient')}
                        disabled={isResolving || isResolvedStatus}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 border font-bold rounded-xl transition-colors disabled:cursor-not-allowed ${
                            isResolvedStatus 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                            : 'bg-white border-gray-200 text-primary hover:bg-gray-50 disabled:opacity-50'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className="text-sm">إعادة للعميل</span>
                    </button>
                </div>

                {/* Dismiss — full width error outline */}
                <button
                    type="button"
                    onClick={() => handleOpenModal('Dismiss')}
                    disabled={isResolving || isResolvedStatus}
                    className={`w-full flex items-center justify-center gap-2 py-3 border-2 font-bold rounded-xl transition-colors disabled:cursor-not-allowed ${
                        isResolvedStatus 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                        : 'bg-white border-error/30 text-error hover:bg-error/5 disabled:opacity-50'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>إغلاق النزاع (بدون إجراء)</span>
                </button>
            </div>


            {/* ── Financial Data ───────────────────────────────── */}
            <div className="mx-5 mb-5 pt-5 border-t border-gray-100">
                <h3 className="font-bold text-sm text-primary mb-4">بيانات مالية</h3>

                <div className="flex flex-col gap-3">
                    {/* Order Amount */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">قيمة الطلب</span>
                        <span className="text-sm font-bold text-gray-800" dir="ltr">
                            {formatCurrency(financials.amount || 0, financials.currency)}
                        </span>
                    </div>

                    {/* Escrow Amount */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">المبلغ المحتجز</span>
                        <span className="text-sm font-bold text-gray-800" dir="ltr">
                            {formatCurrency(financials.escrowAmount, financials.currency)}
                        </span>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">طريقة الدفع</span>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-800" dir="ltr">
                                {financials.paymentMethod}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal Overlay ───────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-primary">
                                {resolutionType === 'ReleaseToLawyer' ? 'تحويل المبلغ للمستشار' :
                                    resolutionType === 'RefundToClient' ? 'إعادة المبلغ للعميل' :
                                        'إغلاق النزاع'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                disabled={isResolving}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block font-bold text-sm text-gray-700 mb-2">
                                    القرار الإداري <span className="text-error">*</span>
                                </label>
                                <textarea
                                    value={adminDecision}
                                    onChange={(e) => setAdminDecision(e.target.value)}
                                    placeholder="اكتب القرار النهائي الذي سيظهر للطرفين..."
                                    rows={3}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-sm text-gray-700 mb-2">
                                    ملاحظات داخلية
                                    <span className="text-xs font-normal text-gray-400 mr-2">(اختياري - خاص بالإدارة)</span>
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="ملاحظات خاصة بالإدارة..."
                                    rows={2}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isResolving}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmResolve}
                                disabled={isResolving || !adminDecision.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResolving && <Spinner />}
                                تأكيد
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Toast Notification ────────────────────────────── */}
            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg font-medium text-sm animate-in slide-in-from-bottom-5 fade-in duration-300 ${
                    toast.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default DisputeAdminActions;

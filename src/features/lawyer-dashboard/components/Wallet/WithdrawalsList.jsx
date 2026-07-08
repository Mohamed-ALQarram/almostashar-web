import React, { useState } from 'react';
import { Calendar, CreditCard, X } from 'lucide-react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount ?? 0);

const formatDate = (dateStr) => {
    if (!dateStr) return {};
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
};

const STATUS_CONFIG = {
    Pending: { label: 'قيد الانتظار', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
    Approved: { label: 'موافق عليه', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
    Paid: { label: 'مدفوع', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    Rejected: { label: 'مرفوض', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
    Cancelled: { label: 'ملغي', bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
};

const METHOD_LABELS = {
    BankTransfer: 'تحويل بنكي',
    VodafoneCash: 'فودافون كاش',
    InstaPay: 'انستا باي',
    Other: 'أخرى',
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const WithdrawalCard = ({ withdrawal, onCancel, isCancelling }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { date, time } = formatDate(withdrawal.requestedAt);
    const isPending = withdrawal.status === 'Pending';

    const handleCancel = () => {
        onCancel(withdrawal.id);
        setShowConfirm(false);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Top row: Amount + Status */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(withdrawal.amount)} ج.م</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{METHOD_LABELS[withdrawal.method] || withdrawal.method}</span>
                        <span className="text-gray-300">|</span>
                        <span>{withdrawal.accountDetailsMasked}</span>
                    </div>
                </div>
                <StatusBadge status={withdrawal.status} />
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{date}</span>
                <span className="text-gray-300">|</span>
                <span>{time}</span>
            </div>

            {/* Rejection reason */}
            {withdrawal.status === 'Rejected' && withdrawal.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-red-700 mb-0.5">تم رفض الطلب</p>
                    <p className="text-xs text-red-600">سبب الرفض: {withdrawal.rejectionReason}</p>
                    <p className="text-xs text-red-500 mt-1">تمت إعادة المبلغ إلى محفظتك</p>
                </div>
            )}

            {/* Paid info */}
            {withdrawal.status === 'Paid' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-emerald-700 mb-0.5">تم الدفع بنجاح</p>
                    {withdrawal.payoutReference && (
                        <p className="text-xs text-emerald-600">رقم التحويل: {withdrawal.payoutReference}</p>
                    )}
                    {withdrawal.paidAt && (
                        <p className="text-xs text-emerald-500 mt-0.5">{formatDate(withdrawal.paidAt).date} - {formatDate(withdrawal.paidAt).time}</p>
                    )}
                </div>
            )}

            {/* Approved info */}
            {withdrawal.status === 'Approved' && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-blue-700">تمت الموافقة على طلبك</p>
                    <p className="text-xs text-blue-600 mt-0.5">بانتظار تنفيذ التحويل</p>
                </div>
            )}

            {/* Cancelled info */}
            {withdrawal.status === 'Cancelled' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-gray-600">تم إلغاء الطلب</p>
                    <p className="text-xs text-gray-500 mt-0.5">تمت إعادة المبلغ إلى محفظتك</p>
                </div>
            )}

            {/* Cancel button for Pending */}
            {isPending && !showConfirm && (
                <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-2 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    إلغاء الطلب
                </button>
            )}

            {/* Confirm cancel */}
            {isPending && showConfirm && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-red-700 font-medium">هل أنت متأكد من إلغاء هذا الطلب؟</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isCancelling ? 'جاري الإلغاء...' : 'نعم، إلغاء'}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            تراجع
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const WithdrawalsList = ({ data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, onCancel, isCancelling }) => {
    const allWithdrawals = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                        <div className="flex justify-between">
                            <div className="h-5 bg-gray-200 rounded w-24" />
                            <div className="h-5 bg-gray-200 rounded-full w-20" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-32" />
                        <div className="h-3 bg-gray-100 rounded w-40" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500 text-sm">
                حدث خطأ أثناء تحميل طلبات السحب.
            </div>
        );
    }

    if (allWithdrawals.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-base font-medium text-gray-700">لا توجد طلبات سحب</h3>
                <p className="text-gray-400 text-sm mt-1">لم تقم بطلب أي سحب بعد.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allWithdrawals.map((w) => (
                    <WithdrawalCard
                        key={w.id}
                        withdrawal={w}
                        onCancel={onCancel}
                        isCancelling={isCancelling}
                    />
                ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2.5 text-sm font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        {isFetchingNextPage ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                جاري التحميل...
                            </span>
                        ) : 'تحميل المزيد'}
                    </button>
                </div>
            )}

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400 mt-6">
                جميع المبالغ تعرض بالجنيه المصري (ج.م)
            </p>
        </div>
    );
};

export default WithdrawalsList;

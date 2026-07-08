import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount ?? 0);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
};

const TransactionRow = ({ transaction }) => {
    const isCredit = transaction.type === 'Credit';
    const { date, time } = formatDate(transaction.createdAt);

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-4 lg:px-6 rounded-lg">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {isCredit
                    ? <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                    : <ArrowUpRight className="w-5 h-5 text-red-500" />
                }
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount)} ج.م
                </p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {getTransactionLabel(transaction)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{transaction.description}</p>
            </div>

            {/* Date */}
            <div className="text-left flex-shrink-0 hidden sm:block">
                <p className="text-xs text-gray-500">{date}</p>
                <p className="text-xs text-gray-400">{time}</p>
            </div>

            {/* Balance after */}
            <div className="text-left flex-shrink-0 hidden md:block">
                <p className="text-xs text-gray-400">الرصيد بعد العملية</p>
                <p className="text-sm font-semibold text-gray-700">{formatCurrency(transaction.balanceAfter)}</p>
            </div>
        </div>
    );
};

const getTransactionLabel = (tx) => {
    const map = {
        Escrow: 'إطلاق مبلغ من الضمان',
        Withdrawal: 'طلب سحب',
        WithdrawalRejection: 'رفض طلب سحب',
        WithdrawalCancellation: 'إلغاء طلب سحب',
    };
    return map[tx.referenceType] || tx.referenceType;
};

const TransactionsList = ({ data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage }) => {
    const allTransactions = data?.pages?.flatMap((page) => page.items ?? []) ?? [];

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="h-3 bg-gray-100 rounded w-48" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-20 hidden sm:block" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500 text-sm">
                حدث خطأ أثناء تحميل المعاملات.
            </div>
        );
    }

    if (allTransactions.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-base font-medium text-gray-700">لا توجد معاملات</h3>
                <p className="text-gray-400 text-sm mt-1">لم تتم أي معاملات بعد.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {allTransactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} />
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
        </div>
    );
};

export default TransactionsList;

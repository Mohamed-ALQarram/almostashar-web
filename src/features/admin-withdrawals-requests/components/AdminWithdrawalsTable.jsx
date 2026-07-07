import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Pending':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    قيد الانتظار
                </span>
            );
        case 'Approved':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    تمت الموافقة
                </span>
            );
        case 'Paid':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    تم الدفع
                </span>
            );
        case 'Rejected':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    مرفوض
                </span>
            );
        case 'Cancelled':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ملغي
                </span>
            );
        default:
            return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
};

const MethodIcon = ({ method }) => {
    switch (method) {
        case 'VodafoneCash':
            return (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm"> فودافون كاش</span>
                </div>
            );

        case 'InstaPay':
            return (
                <div className="flex items-center gap-2">
                    {/* InstaPay icon - Transfer arrows representing money exchange */}
                    <svg className="w-4 h-4 text-[#6F2282]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm"> إنستاباي</span>
                </div>
            );

        default:
            return (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm">تحويل بنكي</span>
                </div>
            );
    }
}

const AdminWithdrawalsTable = ({
    withdrawals,
    isLoading,
    isError,
    hasMore,
    page,
    setPage,
    setCursorHistory,
    data
}) => {
    const navigate = useNavigate();

    // Formatting date helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-right" dir="rtl">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm bg-gray-50/50">
                            <th className="py-4 px-6 font-medium whitespace-nowrap">#</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap">المحامي</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap">البريد الإلكتروني</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap text-left">المبلغ</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap">طريقة السحب</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap">تفاصيل الحساب</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap text-center">الحالة</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap text-center">تاريخ الطلب</th>
                            <th className="py-4 px-6 font-medium whitespace-nowrap text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="py-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جاري التحميل...
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan="9" className="py-8 text-center text-red-500">
                                    حدث خطأ أثناء جلب البيانات
                                </td>
                            </tr>
                        ) : withdrawals?.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="py-8 text-center text-gray-500">
                                    لا توجد طلبات سحب بهذا التصنيف
                                </td>
                            </tr>
                        ) : (
                            withdrawals?.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                        #WD-{String(withdrawal.id).padStart(5, '0')}
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                        {withdrawal.lawyerName}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                        {withdrawal.lawyerEmail}
                                    </td>
                                    <td className="py-4 px-6 text-left whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">{withdrawal.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        <span className="text-gray-500 text-xs mr-1">ج.م</span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <MethodIcon method={withdrawal.method} />
                                    </td>
                                    <td className="py-4 px-6 text-sm whitespace-nowrap">
                                        <div className="text-gray-900" dir="ltr">{withdrawal.accountDetailsMasked}</div>
                                        <div className="text-gray-400 text-xs mt-1">{withdrawal.method === 'VodafoneCash' ? 'فودافون كاش' : withdrawal.method === 'InstaPay' ? 'إنستاباي' : 'تحويل بنكي'}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <StatusBadge status={withdrawal.status} />
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(withdrawal.requestedAt)}</div>
                                        <div className="text-xs text-gray-500 mt-1">{formatTime(withdrawal.requestedAt)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <Button
                                            variant="outline"
                                            className="!px-3 !py-1.5 !text-xs whitespace-nowrap gap-1"
                                            onClick={() => navigate(`/admin/withdrawals/${withdrawal.id}`)}
                                        >
                                            عرض التفاصيل
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <div className="text-sm text-gray-500">
                    {/* Assuming total count is not in response, we just show current state loosely */}
                    عرض الصفحة {page}
                </div>
                <div className="flex gap-2" dir="ltr">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-medium">
                        {page}
                    </div>
                    <button
                        onClick={() => {
                            setCursorHistory(prev => {
                                const newHistory = [...prev];
                                newHistory[page] = data.nextCursor;
                                return newHistory;
                            });
                            setPage(p => p + 1);
                        }}
                        disabled={!hasMore}
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminWithdrawalsTable;

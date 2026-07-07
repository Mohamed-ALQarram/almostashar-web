import React, { useState } from 'react';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import { useAdminWithdrawalsList, AdminWithdrawalsTable } from '../features/admin-withdrawals-requests';

const STATUS_FILTERS = [
    {
        label: 'الكل',
        value: 'All',
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
        activeClass: 'bg-primary text-white border-primary',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
    {
        label: 'قيد الانتظار',
        value: 'Pending',
        icon: <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        activeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
    {
        label: 'تمت الموافقة',
        value: 'Approved',
        icon: <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
        activeClass: 'bg-green-50 text-green-700 border-green-200',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
    {
        label: 'تم الدفع',
        value: 'Paid',
        icon: <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
        activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
    {
        label: 'مرفوض',
        value: 'Rejected',
        icon: <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
        activeClass: 'bg-red-50 text-red-700 border-red-200',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
    {
        label: 'ملغي',
        value: 'Cancelled',
        icon: <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        activeClass: 'bg-gray-100 text-gray-700 border-gray-300',
        inactiveClass: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    },
];


const AdminWithdrawalsPage = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [cursorHistory, setCursorHistory] = useState([null]);

    const pageSize = 20;
    const currentCursor = cursorHistory[page - 1];

    const { data, isLoading, isError } = useAdminWithdrawalsList({ status: statusFilter, cursor: currentCursor, pageSize });
    const withdrawals = data?.items;
    const hasMore = data?.hasMore || false;

    return (
        <AdminLayout title="إدارة طلبات السحب" breadcrumbs={[{ label: 'الرئيسية', path: '/admin' }, { label: 'طلبات السحب', path: '/admin/withdrawals' }]}>
            <div className="space-y-6">

                {/* Header section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            إدارة طلبات السحب
                            <span className="text-gold">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-1">استعرض جميع طلبات السحب المقدمة من المحامين وراجع حالتها.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6" dir="rtl">
                    {STATUS_FILTERS.map((filter) => {
                        const isActive = statusFilter === filter.value;
                        return (
                            <button
                                key={filter.value}
                                onClick={() => {
                                    setStatusFilter(filter.value);
                                    setPage(1); // Reset to first page
                                    setCursorHistory([null]); // Reset cursor history
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all font-medium text-sm ${isActive ? filter.activeClass : filter.inactiveClass
                                    }`}
                            >
                                <span>{filter.label}</span>
                                {filter.icon}
                            </button>
                        );
                    })}
                </div>

                {/* Table Card */}
                <AdminWithdrawalsTable
                    withdrawals={withdrawals}
                    isLoading={isLoading}
                    isError={isError}
                    hasMore={hasMore}
                    page={page}
                    setPage={setPage}
                    setCursorHistory={setCursorHistory}
                    data={data}
                />

            </div>
        </AdminLayout>
    );
};

export default AdminWithdrawalsPage;

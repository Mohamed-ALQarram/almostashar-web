import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDisputes } from '../hooks/useAdminDisputes';

// ─── Status config (English API value → Arabic label + color) ──────
const STATUS_OPTIONS = [
    { value: '', label: 'الكل' },
    { value: 'Open', label: 'مفتوحة' },
    { value: 'UnderReview', label: 'تحت المراجعة' },
    { value: 'AwaitingClientResponse', label: 'بانتظار رد العميل' },
    { value: 'AwaitingLawyerResponse', label: 'بانتظار رد المحامي' },
    { value: 'ResolvedRelease', label: 'تم الحل - إفراج' },
    { value: 'ResolvedRefund', label: 'تم الحل - استرداد' },
    { value: 'Dismissed', label: 'مرفوض' },
];

const STATUS_MAP = {
    Open: { label: 'مفتوحة', color: 'error' },
    UnderReview: { label: 'تحت المراجعة', color: 'warning' },
    AwaitingClientResponse: { label: 'بانتظار رد العميل', color: 'primary' },
    AwaitingLawyerResponse: { label: 'بانتظار رد المحامي', color: 'primary' },
    ResolvedRelease: { label: 'تم الحل - إفراج', color: 'success' },
    ResolvedRefund: { label: 'تم الحل - استرداد', color: 'success' },
    Dismissed: { label: 'مرفوض', color: 'gray' },
};

const PRIORITY_MAP = {
    Critical: { label: 'حرجة', color: 'error' },
    High: { label: 'مرتفعة', color: 'warning' },
    Medium: { label: 'متوسطة', color: 'primary' },
    Low: { label: 'منخفضة', color: 'success' },
};

// ─── Color utilities ───────────────────────────────────────────────
const getStatusClasses = (color) => {
    const map = {
        error: 'bg-error/10 text-error',
        warning: 'bg-warning/10 text-warning',
        success: 'bg-success/10 text-success',
        primary: 'bg-primary/10 text-primary',
        gray: 'bg-gray-100 text-gray-500',
    };
    return map[color] || map.gray;
};

const getDotClasses = (color) => {
    const map = {
        error: 'bg-error',
        warning: 'bg-warning',
        success: 'bg-success',
        primary: 'bg-primary',
        gray: 'bg-gray-400',
    };
    return map[color] || map.gray;
};

// ─── Date formatter ────────────────────────────────────────────────
const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ═══════════════════════════════════════════════════════════════════
const DisputesTable = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchId, setSearchId] = useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useAdminDisputes({ status: statusFilter || undefined, searchId: searchId || undefined });

    // ── Infinite-scroll observer ────────────────────────────────
    const observer = useRef();
    const lastRowRef = useCallback(
        (node) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage],
    );

    // ── Flatten paginated data ──────────────────────────────────
    const allItems = useMemo(
        () => data?.pages?.flatMap((page) => page?.items || []) || [],
        [data],
    );

    // ── Client-side ID filter ───────────────────────────────────
    const filteredItems = useMemo(() => {
        if (!searchId) return allItems;
        return allItems.filter((item) => String(item.id) === searchId);
    }, [allItems, searchId]);

    // ── Search handler ──────────────────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchId(searchInput.replace('#', '').trim());
    };

    // ── Loading skeleton ────────────────────────────────────────
    if (isLoading) {
        return <div className="h-96 bg-white rounded-2xl shadow-sm animate-pulse mb-8"></div>;
    }

    // ── Error state ─────────────────────────────────────────────
    if (isError) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center mb-8" dir="rtl">
                <p className="text-error font-medium">حدث خطأ أثناء تحميل النزاعات. يرجى المحاولة لاحقاً.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 overflow-hidden" dir="rtl">
            {/* ── Header & Controls ────────────────────────────── */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="font-bold text-lg text-primary">النزاعات</h2>
                    <span className="px-3 py-1 bg-gold text-white text-xs font-bold rounded-full">
                        {filteredItems.length} نزاع
                    </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                    {/* Search by ID */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 sm:flex-initial">
                        <div className="relative flex-1 sm:w-48">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="بحث بالرقم التعريفي..."
                                className="w-full pr-9 pl-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            بحث
                        </button>
                    </form>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors cursor-pointer"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Table ────────────────────────────────────────── */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-sm font-medium text-white bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-4 rounded-tr-lg">رقم التذكرة</th>
                            <th scope="col" className="px-6 py-4">المشكلة</th>
                            <th scope="col" className="px-6 py-4">مقدم الطلب</th>
                            <th scope="col" className="px-6 py-4 text-center">الحالة</th>
                            <th scope="col" className="px-6 py-4 text-center">الأولوية</th>
                            <th scope="col" className="px-6 py-4">التاريخ</th>
                            <th scope="col" className="px-6 py-4 text-center rounded-tl-lg">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredItems.map((dispute, idx) => {
                            const isLast = idx === filteredItems.length - 1;
                            const statusInfo = STATUS_MAP[dispute.status] || { label: dispute.status, color: 'gray' };
                            const priorityInfo = PRIORITY_MAP[dispute.priority] || { label: dispute.priority, color: 'gray' };

                            return (
                                <tr
                                    key={dispute.id}
                                    ref={isLast ? lastRowRef : undefined}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                        #{dispute.id}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="font-medium text-gray-900 truncate" title={dispute.reason}>
                                            {dispute.reason}
                                        </p>
                                        {dispute.caseId && (
                                            <span className="text-xs text-gray-400 mt-0.5 block">
                                                رقم القضية: {dispute.caseId}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-sm border border-blue-100">
                                                {dispute.openedByUserName?.charAt(0) || '؟'}
                                            </div>
                                            <span className="text-gray-700 text-sm">{dispute.openedByUserName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(statusInfo.color)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getDotClasses(statusInfo.color)}`}></span>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(priorityInfo.color)}`}>
                                            {priorityInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                        {formatDate(dispute.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-3 text-gray-400">
                                            {/* View */}
                                            <Link to={`/admin/disputes/${dispute.id}`} className="hover:text-primary transition-colors" title="عرض التفاصيل">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                            {/* Dismiss */}
                                            <button className="hover:text-error transition-colors" title="رفض">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">لا توجد نزاعات</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Loading more indicator ───────────────────────── */}
            {isFetchingNextPage && (
                <div className="p-4 text-center text-sm text-gray-400">جاري تحميل المزيد...</div>
            )}

            {/* ── Footer ──────────────────────────────────────── */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
                <span>عرض {filteredItems.length} نزاع</span>
            </div>
        </div>
    );
};

export default DisputesTable;

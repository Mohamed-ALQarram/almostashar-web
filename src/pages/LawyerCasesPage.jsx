import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LawyerLayout } from '../features/lawyer-dashboard';
import CaseCard from '../features/lawyer-dashboard/components/Cases/CaseCard';
import CaseDetails from '../features/lawyer-dashboard/components/Cases/CaseDetails';
import { useLawyerCases } from '../features/lawyer-dashboard/hooks/useLawyerCases';
import { FileText, ChevronDown } from 'lucide-react';

// ─── Tab Configuration ──────────────────────────────────────────────
const OPEN_STATUSES = ['Open', 'InProgress', 'PendingConfirmation', 'OnHold'];
const CLOSED_STATUSES = ['Closed', 'Dismissed', 'Canceled'];

const TABS = [
    { key: 'open', label: 'طلبات مفتوحة', statuses: OPEN_STATUSES },
    { key: 'closed', label: 'طلبات مكتملة', statuses: CLOSED_STATUSES },
];

// ─── Loading Skeleton ───────────────────────────────────────────────
const CaseCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>
        <div className="px-5 pb-4 space-y-3">
            <div className="h-5 w-48 bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-50 rounded" />
            <div className="flex gap-4">
                <div className="h-3 w-24 bg-gray-50 rounded" />
                <div className="h-3 w-20 bg-gray-50 rounded" />
            </div>
        </div>
        <div className="flex gap-2 px-5 py-3.5 border-t border-gray-50 bg-gray-50/50">
            <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
        </div>
    </div>
);

// ─── Empty State ────────────────────────────────────────────────────
const EmptyState = ({ isOpen }) => (
    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <div className="text-gray-300 mb-4">
            <FileText className="w-16 h-16 mx-auto" strokeWidth={1} />
        </div>
        <h3 className="text-lg font-semibold text-gray-500 mb-1">
            {isOpen ? 'لا توجد قضايا مفتوحة' : 'لا توجد قضايا مكتملة'}
        </h3>
        <p className="text-sm text-gray-400">
            {isOpen
                ? 'ستظهر هنا القضايا الجديدة والمفتوحة عند ورودها.'
                : 'ستظهر هنا القضايا المكتملة والمغلقة.'}
        </p>
    </div>
);

// ─── Main Page Component ────────────────────────────────────────────
const LawyerCasesPage = () => {
    const [activeTab, setActiveTab] = useState('open');
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const navigate = useNavigate();

    const currentTab = TABS.find((t) => t.key === activeTab);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useLawyerCases();

    // Flatten all pages and filter client-side by active tab
    const allCases = data?.pages?.flatMap((page) => page.items || []) || [];
    const cases = allCases.filter((c) => currentTab.statuses.includes(c.status));

    // ── Navigate to chat with this client ──
    const handleMessageClient = (caseItem) => {
        if (!caseItem.chat) return;

        navigate('/lawyer-dashboard/chats', {
            state: {
                selectedChat: {
                    chatId: caseItem.chat.chatId,
                    userId: caseItem.chat.receiverId,
                    fullName: caseItem.chat.fullName,
                    profileImage: caseItem.chat.profileImage,
                    caseType: caseItem.serviceType,
                },
            },
        });
    };

    // ── Open case details ──
    const handleViewDetails = (caseItem) => {
        setSelectedCaseId(caseItem.id);
    };

    return (
        <LawyerLayout>
            <div className="max-w-7xl mx-auto pb-10" dir="rtl">

                {selectedCaseId ? (
                    <CaseDetails
                        caseId={selectedCaseId}
                        onBack={() => setSelectedCaseId(null)}
                    />
                ) : (
                    <>
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                                    إدارة القضايا
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    تابع جميع قضاياك المفتوحة والمكتملة وتواصل مع عملائك بسهولة.
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 max-w-md">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        activeTab === tab.key
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <CaseCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100">
                                <svg className="w-12 h-12 mx-auto text-red-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-red-600 mb-1">حدث خطأ</h3>
                                <p className="text-sm text-red-400">تعذر تحميل القضايا. يرجى المحاولة مرة أخرى.</p>
                            </div>
                        )}

                        {/* Cases Grid */}
                        {!isLoading && !isError && (
                            <>
                                {cases.length === 0 ? (
                                    <EmptyState isOpen={activeTab === 'open'} />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {cases.map((caseItem) => (
                                            <CaseCard
                                                key={caseItem.id}
                                                caseItem={caseItem}
                                                onMessageClient={handleMessageClient}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Load More Button */}
                                {hasNextPage && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gold/40 hover:bg-gold/5 text-gray-700 hover:text-gold-dark px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isFetchingNextPage ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>جاري التحميل...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    <span>تحميل المزيد</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </LawyerLayout>
    );
};

export default LawyerCasesPage;

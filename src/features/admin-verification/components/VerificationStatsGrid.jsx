import React from 'react';
import { useVerificationStats, useUnverifiedLawyers } from '../hooks/useAdminVerification';

const VerificationStatsGrid = () => {
    const { data: stats, isLoading: statsLoading } = useVerificationStats();
    const { data: lawyers, isLoading: lawyersLoading } = useUnverifiedLawyers();

    const isLoading = statsLoading || lawyersLoading;

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse mb-8">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white rounded-2xl shadow-sm"></div>)}
        </div>;
    }

    if (!stats) return null;

    // Use real pending count from the unverified lawyers list
    const pendingCount = lawyers?.length ?? 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full" dir="rtl">

            {/* Pending Review Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex justify-between items-center border-r-[3px] border-r-gold">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stats.pendingReview.label}</h3>
                    <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            {/* Approved This Month Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex justify-between items-center border-r-[3px] border-r-success">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stats.approvedThisMonth.label}</h3>
                    <div className="text-3xl font-bold text-gray-900">{stats.approvedThisMonth.value}</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            {/* Rejected This Month Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex justify-between items-center border-r-[3px] border-r-error">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stats.rejectedThisMonth.label}</h3>
                    <div className="text-3xl font-bold text-gray-900">{stats.rejectedThisMonth.value}</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center text-error">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

        </div>
    );
};

export default VerificationStatsGrid;

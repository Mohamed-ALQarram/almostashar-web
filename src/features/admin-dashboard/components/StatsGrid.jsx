import React from 'react';
import { useDashboardStats } from '../hooks/useAdminDashboard';

const StatsGrid = () => {
    const { data: stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl shadow-sm"></div>)}
        </div>;
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full" dir="rtl">

            {/* Total Balance Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    {stats.totalBalance.trend && (
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${stats.totalBalance.isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span dir="ltr">{stats.totalBalance.trend}</span>
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">رصيد المنصة الكلي</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{stats.totalBalance.value.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{stats.totalBalance.currency}</span>
                    </div>
                </div>
            </div>

            {/* In Escrow Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/5 flex items-center justify-center text-gold">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    {stats.inEscrow.trend && (
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${stats.inEscrow.isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span dir="ltr">{stats.inEscrow.trend}</span>
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">في الضمان (Escrow)</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{stats.inEscrow.value.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{stats.inEscrow.currency}</span>
                    </div>
                </div>
            </div>

            {/* Available for Withdrawal Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50/50 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                </div>
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">متاح للسحب</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{stats.availableForWithdrawal.value.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{stats.availableForWithdrawal.currency}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StatsGrid;

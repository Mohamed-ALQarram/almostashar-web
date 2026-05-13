import React from 'react';
import { useLawyerAnalytics } from '../hooks/useLawyerDashboard';

const StatsCards = () => {
    const { data: stats, isLoading } = useLawyerAnalytics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" dir="rtl">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-36 bg-white rounded-2xl shadow-sm animate-pulse" />
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: 'طلبات جديدة',
            value: stats?.newIncomingRequestsCount ?? 0,
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            label: 'مواعيد مهمة',
            value: stats?.completedCasesCount ?? 0,
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-500',
        },
        {
            label: 'قضايا مفتوحة',
            value: stats?.openCasesCount ?? 0,
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
        {
            label: 'رصيد',
            value: stats?.monthlyEarnings != null ? `${stats.monthlyEarnings.toLocaleString()} ج.م` : '—',
            isBalance: true,
            icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            iconBg: 'bg-primary/5',
            iconColor: 'text-primary',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" dir="rtl">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50/80 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow duration-300"
                >
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                        {card.icon}
                    </div>
                    <span className={`font-bold ${card.isBalance ? 'text-xl' : 'text-3xl'} text-gray-900 leading-none`}>
                        {card.value}
                    </span>
                    <span className="text-sm text-gray-500">{card.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;

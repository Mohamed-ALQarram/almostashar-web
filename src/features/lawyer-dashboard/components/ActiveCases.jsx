import React from 'react';
import { useActiveCases } from '../hooks/useLawyerDashboard';

const statusStyles = {
    'جاري': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'تحت المداولة': 'bg-gray-100 text-gray-600 border-gray-200',
    'معلقة': 'bg-amber-50 text-amber-600 border-amber-200',
};

const borderColors = {
    'جاري': 'border-r-emerald-500',
    'تحت المداولة': 'border-r-gray-400',
    'معلقة': 'border-r-amber-500',
};

const ActiveCases = () => {
    const { data: cases, isLoading } = useActiveCases(5);

    return (
        <section dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">قضايا نشطة</h2>
                    <p className="text-sm text-gray-400">إدارة ومراجعة القضايا المفتوحة والجديدة بها</p>
                </div>
                <button className="text-sm text-gold hover:text-gold-dark font-medium transition-colors whitespace-nowrap">
                    عرض الكل
                </button>
            </div>

            {/* Cases List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                                <div className="h-3 bg-gray-50 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : !cases || cases.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-sm">لا توجد قضايا نشطة</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {cases.map((c) => (
                            <div
                                key={c.caseId}
                                className={`p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-r-4 ${
                                    borderColors[c.status] || 'border-r-gray-300'
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 truncate">{c.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1 truncate">{c.secondaryText}</p>
                                </div>
                                <span
                                    className={`text-[11px] font-medium px-3 py-1 rounded-full border whitespace-nowrap ${
                                        statusStyles[c.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}
                                >
                                    {c.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ActiveCases;

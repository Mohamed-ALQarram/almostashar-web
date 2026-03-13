import React from 'react';
import { useTopConsultants } from '../hooks/useAdminDashboard';

const TopConsultants = () => {
    const { data: consultants, isLoading } = useTopConsultants();

    if (isLoading) {
        return <div className="h-96 w-full bg-white rounded-2xl shadow-sm animate-pulse"></div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 flex flex-col h-full" dir="rtl">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <h2 className="font-bold text-gray-900">أفضل المستشارين</h2>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {consultants?.map((consultant, index) => (
                    <div key={consultant.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">

                        {/* Rank Number & Avatar */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={consultant.image} alt={consultant.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <span className="absolute -bottom-1 -left-1 w-5 h-5 bg-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                    {index + 1}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-gray-900">{consultant.name}</h3>
                                <p className="text-xs text-gray-500">{consultant.title}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="text-left flex flex-col items-end">
                            <div className="flex items-center gap-0.5 text-gold">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(consultant.rating) ? 'fill-current' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">{consultant.reviews} استشارة</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopConsultants;

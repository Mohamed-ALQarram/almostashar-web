import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncomingRequests } from '../../hooks/useLawyerDashboard';
import RequestCard from './RequestCard';

const IncomingRequests = () => {
    const navigate = useNavigate();
    const { data: requests, isLoading } = useIncomingRequests({ status: 'Pending' });

    // Show top 4 on the dashboard
    const displayRequests = (requests || []).slice(0, 4);

    return (
        <section className="mb-8" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">طلبات العملاء الواردة</h2>
                    <p className="text-sm text-gray-400">إدارة ومراجعة طلبات الاستشارة الواردة من العملاء المحتملين.</p>
                </div>
                <button
                    onClick={() => navigate('/lawyer-dashboard/requests')}
                    className="text-sm text-gold hover:text-gold-dark font-medium transition-colors whitespace-nowrap"
                >
                    عرض الكل
                </button>
            </div>

            {/* Cards row */}
            {isLoading ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[250px] h-56 bg-white rounded-2xl shadow-sm animate-pulse flex-shrink-0" />
                    ))}
                </div>
            ) : displayRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-400 text-sm">لا توجد طلبات واردة حالياً</p>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {displayRequests.map((req) => (
                        <RequestCard key={req.id} request={req} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default IncomingRequests;

import React from 'react';
import {
    LawyerLayout,
    StatsCards,
    IncomingRequests,
    ActiveCases,
    LastMessages
} from '../features/lawyer-dashboard';

const LawyerDashboardPage = () => {
    return (
        <LawyerLayout>
            <div className="max-w-7xl mx-auto" dir="rtl">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">الصفحة الرئيسية</h1>
                    <p className="text-sm text-gray-400 mt-1">ما المطلوب اليوم</p>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Incoming Requests */}
                <IncomingRequests />

                {/* Bottom Grid: Messages + Active Cases */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LastMessages />
                    <ActiveCases />
                </div>
            </div>
        </LawyerLayout>
    );
};

export default LawyerDashboardPage;

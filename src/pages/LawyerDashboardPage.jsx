import React from 'react';
import LawyerLayout from '../features/lawyer-dashboard/components/LawyerLayout';
import StatsCards from '../features/lawyer-dashboard/components/StatsCards';
import IncomingRequests from '../features/lawyer-dashboard/components/IncomingRequests';
import ActiveCases from '../features/lawyer-dashboard/components/ActiveCases';
import LastMessages from '../features/lawyer-dashboard/components/LastMessages';

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

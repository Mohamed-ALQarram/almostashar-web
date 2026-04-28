import React from 'react';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import StatsGrid from '../features/admin-dashboard/components/StatsGrid';
import WithdrawalRequests from '../features/admin-dashboard/components/WithdrawalRequests';
import OpenDisputes from '../features/admin-dashboard/components/OpenDisputes';
import TopConsultants from '../features/admin-dashboard/components/TopConsultants';

const AdminDashboardPage = () => {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <StatsGrid />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area (Tables) */}
                    <div className="flex-1 min-w-0 w-full lg:w-2/3 flex flex-col gap-0">
                        <WithdrawalRequests />
                        <OpenDisputes />
                    </div>

                    {/* Sidebar Area (Top Consultants) */}
                    <div className="w-full lg:w-1/3 min-w-0">
                        <TopConsultants />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;

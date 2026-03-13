import React from 'react';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import VerificationStatsGrid from '../features/admin-verification/components/VerificationStatsGrid';
import VerificationRequestsTable from '../features/admin-verification/components/VerificationRequestsTable';

const AdminVerificationPage = () => {
    // Dynamic header props
    const title = "لوحة تحكم المستشار";
    const breadcrumbs = [
        { label: "لوحة التحكم", path: "/admin" },
        { label: "التحقق من المحامين" }
    ];

    return (
        <AdminLayout title={title} breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto">
                {/* Page Sub-header Title specific to this page (apart from the main header) */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">التحقق من المحامين</h2>
                    <p className="text-gray-500 text-sm">مراجعة طلبات تسجيل المحامين الجدد والتحقق من الوثائق المقدمة</p>
                </div>

                {/* 3 Summary Cards */}
                <VerificationStatsGrid />

                {/* Main Table */}
                <VerificationRequestsTable />
            </div>
        </AdminLayout>
    );
};

export default AdminVerificationPage;

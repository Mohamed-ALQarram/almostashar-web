import React from 'react';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import DisputesTable from '../features/admin-disputes/components/DisputesTable';

const AdminDisputesPage = () => {
    const title = "إدارة النزاعات";
    const breadcrumbs = [
        { label: "لوحة التحكم", path: "/admin" },
        { label: "النزاعات" }
    ];

    return (
        <AdminLayout title={title} breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto">
                {/* Page Sub-header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-2">إدارة النزاعات</h2>
                    <p className="text-gray-500 text-sm">عرض ومتابعة جميع النزاعات المفتوحة والمغلقة بين العملاء والمحامين</p>
                </div>

                {/* Disputes Table */}
                <DisputesTable />
            </div>
        </AdminLayout>
    );
};

export default AdminDisputesPage;

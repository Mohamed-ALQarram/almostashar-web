import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, title, breadcrumbs }) => {
    return (
        <div className="min-h-screen bg-[#F8F9FB] flex" dir="rtl">
            <AdminSidebar />
            <div className="flex-1 flex flex-col mr-64">
                <AdminHeader title={title} breadcrumbs={breadcrumbs} />
                <main className="p-8 pb-12 flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

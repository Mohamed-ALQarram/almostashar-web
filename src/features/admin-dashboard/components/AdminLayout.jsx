import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, title, breadcrumbs }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex" dir="rtl">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 min-w-0 flex flex-col mr-0 lg:mr-64">
                <AdminHeader
                    title={title}
                    breadcrumbs={breadcrumbs}
                    onMenuToggle={() => setSidebarOpen(true)}
                />
                <main className="p-4 sm:p-6 lg:p-8 pb-12 flex-1 min-w-0 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

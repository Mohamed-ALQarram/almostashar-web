import React from 'react';
import LawyerSidebar from './LawyerSidebar';
import LawyerHeader from './LawyerHeader';
import { useLawyerSidebarStore } from '../store/lawyerSidebarStore';

const LawyerLayout = ({ children }) => {
    const { setOpen, isCollapsed } = useLawyerSidebarStore();

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex" dir="rtl">
            <LawyerSidebar />
            <div
                className={`flex-1 min-w-0 flex flex-col mr-0 transition-all duration-300 ${
                    isCollapsed ? 'lg:mr-20' : 'lg:mr-64'
                }`}
            >
                <LawyerHeader onMenuToggle={() => setOpen(true)} />
                <main className="p-4 sm:p-6 lg:p-8 pb-12 flex-1 min-w-0 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default LawyerLayout;

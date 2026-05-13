import React from 'react';
import { LawyerLayout } from '../features/lawyer-dashboard';
import LawyerProfile from '../features/lawyer-dashboard/components/Profile/LawyerProfile';

const LawyerProfilePage = () => {
    return (
        <LawyerLayout>
            <div className="max-w-7xl mx-auto" dir="rtl">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">الملف الشخصي</h1>
                    <p className="text-sm text-gray-400 mt-1">عرض وتعديل بياناتك الشخصية</p>
                </div>

                {/* Profile Component */}
                <LawyerProfile />
            </div>
        </LawyerLayout>
    );
};

export default LawyerProfilePage;

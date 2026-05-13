import React, { useState } from 'react';
import {
    LawyerLayout,
    useLawyerServices,
    LawyerServiceCard,
    AddLawyerServiceModal,
    EditLawyerServiceModal
} from '../features/lawyer-dashboard';

const LawyerServicesPage = () => {
    const { data: servicesResponse, isLoading, isError } = useLawyerServices();

    // API might return { data: [...] } or just [...]
    const services = Array.isArray(servicesResponse?.data)
        ? servicesResponse.data
        : (Array.isArray(servicesResponse) ? servicesResponse : []);

    const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedEditService, setSelectedEditService] = useState(null);

    const filteredServices = services.filter(service => {
        if (filter === 'active') return service.isActive;
        if (filter === 'inactive') return !service.isActive;
        return true;
    });

    return (
        <LawyerLayout>
            <div className="max-w-7xl mx-auto pb-10" dir="rtl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">الخدمات القانونية</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            إدارة وتحديث باقات الخدمات القانونية المتاحة للعملاء.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>إضافة خدمة جديدة</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#0f172a] text-white' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'active' ? 'bg-[#0f172a] text-white' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        نشط
                    </button>
                    <button
                        onClick={() => setFilter('inactive')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'inactive' ? 'bg-[#0f172a] text-white' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        غير نشط
                    </button>
                </div>

                {/* Loading / Error States */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {isError && (
                    <div className="text-center py-20 text-red-500">
                        حدث خطأ أثناء تحميل الخدمات.
                    </div>
                )}

                {/* Services Grid */}
                {!isLoading && !isError && (
                    <>
                        {filteredServices.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700">لا توجد خدمات</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {filter === 'all' ? 'لم تقم بإضافة أي خدمات بعد.' : 'لا توجد خدمات تطابق الفلتر المحدد.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredServices.map(service => (
                                    <LawyerServiceCard
                                        key={service.serviceId}
                                        service={service}
                                        onEdit={(serviceData) => setSelectedEditService(serviceData)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <AddLawyerServiceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditLawyerServiceModal
                isOpen={!!selectedEditService}
                service={selectedEditService}
                onClose={() => setSelectedEditService(null)}
            />
        </LawyerLayout>
    );
};

export default LawyerServicesPage;

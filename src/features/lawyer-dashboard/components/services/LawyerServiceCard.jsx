import React, { useState } from 'react';
import { useUpdateLawyerService } from '../../hooks/useLawyerServices';

const LawyerServiceCard = ({ service, onEdit }) => {
    const { title, description, price, isActive, serviceId } = service;
    const [activeState, setActiveState] = useState(isActive);
    const { mutate: updateService, isPending } = useUpdateLawyerService();

    const handleToggleActive = () => {
        const newState = !activeState;
        // Optimistic UI update
        setActiveState(newState);
        
        updateService(
            { serviceId, data: { isActive: newState } },
            {
                onError: () => {
                    // Revert on error
                    setActiveState(!newState);
                }
            }
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative transition-all duration-300 hover:shadow-md">
            {/* Header: Toggle and Icon */}
            <div className="flex justify-between items-start mb-4">
                {/* Active Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleActive}
                        disabled={isPending}
                        className={`w-10 h-5 rounded-full flex items-center transition-colors px-1 ${
                            activeState ? 'bg-primary' : 'bg-gray-300'
                        }`}
                        dir="ltr"
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                activeState ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                    </button>
                    <span
                        className={`text-xs px-2 py-1 rounded-md ${
                            activeState ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                        {activeState ? 'نشط' : 'غير نشط'}
                    </span>
                </div>

                {/* Document Icon */}
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="text-right flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {description || 'لا يوجد وصف متاح لهذه الخدمة.'}
                </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-100 my-4" />

            {/* Footer: Edit and Price */}
            <div className="flex justify-between items-center text-right">
                <button
                    onClick={() => onEdit(service)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    title="تعديل الخدمة"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>

                <div className="text-gold font-bold text-lg">
                    {price} <span className="text-sm font-normal">ج.م</span>
                </div>
            </div>
        </div>
    );
};

export default LawyerServiceCard;

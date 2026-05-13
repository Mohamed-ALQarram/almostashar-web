import React, { useState, useEffect } from 'react';
import { useUpdateLawyerService } from '../../hooks/useLawyerServices';

const EditLawyerServiceModal = ({ isOpen, onClose, service }) => {
    const { mutate: updateService, isPending } = useUpdateLawyerService();

    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');

    // Pre-fill form when service changes
    useEffect(() => {
        if (service) {
            setDuration(service.duration || '');
            setPrice(service.price ? service.price.toString() : '');
        }
    }, [service]);

    if (!isOpen || !service) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Only submit if something changed
        const updates = {};
        if (duration !== service.duration) updates.duration = duration;
        const priceFloat = parseFloat(price);
        if (!isNaN(priceFloat) && priceFloat !== service.price) updates.price = priceFloat;

        if (Object.keys(updates).length === 0) {
            onClose(); // No changes
            return;
        }

        updateService(
            { serviceId: service.serviceId, data: updates },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error('Failed to update service:', error);
                    // Handle error here
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-[#0f172a] text-white p-6 text-center relative">
                    <h2 className="text-xl font-bold">تعديل الخدمة</h2>
                    <button 
                        onClick={onClose}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Shadow/Gradient separator */}
                <div className="h-4 bg-gradient-to-b from-gray-900/10 to-transparent w-full" />

                <div className="p-6 pt-2">
                    {/* Current Service Info Card */}
                    <div className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center mb-6 shadow-sm">
                        <div className="flex-1 text-right">
                            <span className="text-xs text-gray-400 mb-1 block">الخدمة الحالية</span>
                            <h3 className="font-bold text-gray-800 text-sm">{service.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {service.description || 'تفاصيل الخدمة'}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            {/* Placeholder for legal scale icon */}
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="relative border-t border-gray-100 pt-6">
                            <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-white px-3 text-sm font-bold text-primary">
                                بيانات الخدمة
                            </div>
                            
                            <div className="space-y-5">
                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">المدة المتوقعة</label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="مثال : 3 أيام"
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">السعر المتوقع</label>
                                    <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                        <div className="bg-gray-200 px-4 py-3 flex items-center justify-center border-l border-gray-300 text-gold font-bold">
                                            ج.م
                                        </div>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="500"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full px-4 py-3 focus:outline-none text-gray-700"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl py-4 font-bold transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span>حفظ التغييرات</span>
                            {isPending ? (
                                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditLawyerServiceModal;

import React, { useState } from 'react';
import { useAddLawyerService, useLegalServicesCatalog } from '../../hooks/useLawyerServices';

const AddLawyerServiceModal = ({ isOpen, onClose }) => {
    const { data: catalogServices = [], isLoading: isLoadingCatalog } = useLegalServicesCatalog();
    const { mutate: addService, isPending } = useAddLawyerService();

    const [serviceId, setServiceId] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!serviceId || !duration || !price) return;

        addService(
            { serviceId: parseInt(serviceId, 10), duration, price: parseFloat(price) },
            {
                onSuccess: () => {
                    setServiceId('');
                    setDuration('');
                    setPrice('');
                    onClose();
                },
                onError: (error) => {
                    console.error('Failed to add service:', error);
                    // Handle error (could add a toast notification here)
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-[#0f172a] text-white p-6 text-center relative">
                    <h2 className="text-xl font-bold">إضافة خدمة جديدة</h2>
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

                {/* Form */}
                <div className="p-6 pt-2">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Service Selection */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">اسم الخدمة</label>
                            <div className="relative">
                                <select
                                    value={serviceId}
                                    onChange={(e) => setServiceId(e.target.value)}
                                    disabled={isLoadingCatalog}
                                    required
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 bg-white"
                                >
                                    <option value="" disabled>اختر نوع الخدمة</option>
                                    {catalogServices.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

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

                        {/* Alert */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mt-6">
                            <div className="text-amber-500 mt-0.5 flex-shrink-0">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                يرجى التأكد من دقة البيانات المدخلة.
                                <br />
                                مراجعة الخدمة قد تستغرق ما يصل إلى 24 ساعة قبل نشرها في ملفك.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl py-4 font-bold transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span>إضافة الخدمة</span>
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

export default AddLawyerServiceModal;

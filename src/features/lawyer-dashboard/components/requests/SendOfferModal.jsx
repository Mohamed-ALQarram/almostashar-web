import React, { useState } from 'react';
import { useAuthStore } from '../../../../features/auth/store/authStore';

const SendOfferModal = ({ isOpen, onClose, request, onSubmit, isSubmitting }) => {
    const { user } = useAuthStore();
    const [note, setNote] = useState('');
    const [offeredAmount, setOfferedAmount] = useState('');

    if (!isOpen || !request) return null;

    const handleClose = () => {
        setNote('');
        setOfferedAmount('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Note: The UI doesn't seem to prompt for legalServiceId, 
        // so we omit it or use request.legalServiceId if applicable.
        onSubmit({
            offeredAmount: Number(offeredAmount),
            note: note,
            legalServiceId: request.legalServiceId || undefined
        });
        setNote('');
        setOfferedAmount('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" dir="rtl">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-center p-6 border-b border-gray-100 relative">
                    <button
                        onClick={handleClose}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">إرسال عرض</h2>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Request Info Box */}
                    <div className="bg-blue-50/50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-blue-100/50">
                        <div className="flex-1 text-right">
                            <h3 className="font-bold text-gray-900 text-base mb-1">{request.serviceTitle || request.title || 'طلب خدمة'}</h3>
                            <p className="text-gray-500 text-sm">من: {request.clientName || 'عميل'}</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm flex-shrink-0">
                            <span>{request.clientName ? request.clientName.charAt(0) : 'ع'}</span>
                        </div>
                    </div>

                    <form id="offerForm" onSubmit={handleSubmit} className="space-y-6 text-right">
                        {/* Note */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">رسالة العرض</label>
                            <textarea
                                required
                                rows={4}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="اكتب رسالة عرضك هنا..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">الميزانية / السعر المقترح</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={offeredAmount}
                                    onChange={(e) => setOfferedAmount(e.target.value)}
                                    placeholder="أدخل السعر"
                                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none pointer-events-none">
                                    ج.م
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-gray-100 flex gap-3">
                    <button
                        type="submit"
                        form="offerForm"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <span>إرسال العرض</span>
                        {isSubmitting && (
                            <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-[0.5] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl font-bold transition-colors disabled:opacity-70"
                    >
                        إلغاء
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SendOfferModal;

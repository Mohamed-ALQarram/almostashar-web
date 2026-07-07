import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const RejectWithdrawalModal = ({ isOpen, onClose, onConfirm, isPending }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!rejectionReason.trim()) {
            setError('سبب الرفض مطلوب');
            return;
        }
        setError('');
        onConfirm({ rejectionReason, adminNotes });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" dir="rtl">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-center p-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center absolute top-6">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="mt-14 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">رفض طلب السحب</h3>
                        <p className="text-sm text-gray-500">سيتم إعادة المبلغ المحجوز إلى رصيد المحامي المتاح عند رفض الطلب.</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                سبب الرفض <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => {
                                    setRejectionReason(e.target.value);
                                    if (e.target.value.trim()) setError('');
                                }}
                                placeholder="اكتب سبب رفض طلب السحب..."
                                className={`w-full border ${error ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-300 focus:border-red-300' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'} rounded-xl p-4 min-h-[120px] text-sm outline-none resize-none`}
                                maxLength={500}
                            />
                            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                            <div className="text-left text-xs text-gray-400 mt-1">{rejectionReason.length}/500</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                ملاحظات الإدارة (اختياري)
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="أي ملاحظات إضافية..."
                                className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                maxLength={500}
                            />
                            <div className="text-left text-xs text-gray-400 mt-1">{adminNotes.length}/500</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <Button variant="outline" className="flex-1 bg-white" onClick={onClose} disabled={isPending}>
                        إلغاء
                    </Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600" onClick={handleSubmit} isLoading={isPending}>
                        تأكيد الرفض
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RejectWithdrawalModal;

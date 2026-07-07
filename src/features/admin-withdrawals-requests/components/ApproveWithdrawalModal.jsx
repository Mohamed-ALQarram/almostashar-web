import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const ApproveWithdrawalModal = ({ isOpen, onClose, onConfirm, isPending }) => {
    const [adminNotes, setAdminNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onConfirm({ adminNotes });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" dir="rtl">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-center p-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center absolute top-6">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="mt-14 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">موافقة على طلب السحب</h3>
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
                                ملاحظات الإدارة (اختياري)
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="أضف ملاحظات داخلية (اختياري)..."
                                className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                maxLength={500}
                            />
                        </div>

                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-600">سيتم نقل الطلب إلى حالة "معتمد" وسيظل بانتظار تنفيذ الدفع.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <Button variant="outline" className="flex-1 bg-white" onClick={onClose} disabled={isPending}>
                        إلغاء
                    </Button>
                    <Button className="flex-1 bg-primary text-white border-primary" onClick={handleSubmit} isLoading={isPending}>
                        تأكيد الموافقة
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithdrawalModal;

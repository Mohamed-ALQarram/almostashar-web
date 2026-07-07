import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const MarkPaidWithdrawalModal = ({ isOpen, onClose, onConfirm, isPending }) => {
    const [payoutProvider, setPayoutProvider] = useState('');
    const [payoutReference, setPayoutReference] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleSubmit = () => {
        const newErrors = {};
        if (!payoutProvider) newErrors.payoutProvider = 'جهة الدفع مطلوبة';
        if (!payoutReference.trim()) newErrors.payoutReference = 'مرجع عملية الدفع مطلوب';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onConfirm({ payoutProvider, payoutReference, adminNotes });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" dir="rtl">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-center p-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center absolute top-6">
                        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="mt-14 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الدفع اليدوي</h3>
                        <p className="text-sm text-gray-500">سيتم تحويل حالة الطلب إلى مدفوع وتسجيل مرجع عملية الدفع.</p>
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
                                جهة الدفع <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={payoutProvider}
                                onChange={(e) => {
                                    setPayoutProvider(e.target.value);
                                    if (e.target.value) setErrors(prev => ({ ...prev, payoutProvider: null }));
                                }}
                                className={`w-full border ${errors.payoutProvider ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-300 focus:border-red-300' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'} rounded-xl p-3 text-sm outline-none bg-white`}
                            >
                                <option value="">اختر جهة الدفع</option>
                                <option value="VodafoneCash">فودافون كاش</option>
                                <option value="InstaPay">إنستاباي</option>
                                <option value="BankTransfer">تحويل بنكي</option>
                                <option value="Other">أخرى</option>
                            </select>
                            {errors.payoutProvider && <p className="text-xs text-red-500 mt-1">{errors.payoutProvider}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                مرجع عملية الدفع <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={payoutReference}
                                onChange={(e) => {
                                    setPayoutReference(e.target.value);
                                    if (e.target.value.trim()) setErrors(prev => ({ ...prev, payoutReference: null }));
                                }}
                                placeholder="أدخل مرجع عملية الدفع"
                                className={`w-full border ${errors.payoutReference ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-300 focus:border-red-300' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'} rounded-xl p-3 text-sm outline-none`}
                            />
                            {errors.payoutReference && <p className="text-xs text-red-500 mt-1">{errors.payoutReference}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                ملاحظات الإدارة (اختياري)
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="أضف أي ملاحظات داخلية (اختياري)..."
                                className="w-full border border-gray-200 rounded-xl p-4 min-h-[100px] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                maxLength={250}
                            />
                            <div className="text-left text-xs text-gray-400 mt-1">{adminNotes.length}/250</div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="flex-1 bg-white" onClick={onClose} disabled={isPending}>
                            إلغاء
                        </Button>
                        <Button className="flex-1 bg-primary text-white border-primary" onClick={handleSubmit} isLoading={isPending}>
                            <span className="flex items-center justify-center gap-2">
                                تأكيد الدفع
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </span>
                        </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        هذا الإجراء مسجل في سجل النظام ولا يمكن التراجع عنه.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkPaidWithdrawalModal;

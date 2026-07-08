import React, { useState } from 'react';
import { X, ChevronDown, Building2, Smartphone, Zap, MoreHorizontal } from 'lucide-react';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount ?? 0);

const METHODS = [
    { value: 'BankTransfer', label: 'تحويل بنكي', icon: Building2 },
    { value: 'VodafoneCash', label: 'فودافون كاش', icon: Smartphone },
    { value: 'InstaPay', label: 'انستا باي', icon: Zap },
    { value: 'Other', label: 'أخرى', icon: MoreHorizontal },
];

const WithdrawModal = ({ isOpen, onClose, onSubmit, isSubmitting, availableBalance }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [accountDetails, setAccountDetails] = useState('');
    const [showMethodDropdown, setShowMethodDropdown] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const selectedMethod = METHODS.find(m => m.value === method);

    const validate = () => {
        const newErrors = {};
        const numAmount = parseFloat(amount);

        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = 'يرجى إدخال مبلغ صحيح';
        } else if (numAmount > (availableBalance ?? 0)) {
            newErrors.amount = `المبلغ يجب أن يكون أقل من أو يساوي الرصيد المتاح (${formatCurrency(availableBalance)} ج.م)`;
        }

        if (!method) {
            newErrors.method = 'يرجى اختيار طريقة السحب';
        }

        if (!accountDetails.trim()) {
            newErrors.accountDetails = 'يرجى إدخال بيانات الحساب';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            amount: parseFloat(amount),
            method,
            accountDetails: accountDetails.trim(),
        });
    };

    const handleClose = () => {
        setAmount('');
        setMethod('');
        setAccountDetails('');
        setErrors({});
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-50 animate-fadeIn" onClick={handleClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div
                    className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                        <h2 className="text-lg font-bold text-primary">طلب سحب</h2>
                        <button
                            onClick={handleClose}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-5">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">المبلغ</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: undefined })); }}
                                    placeholder="أدخل المبلغ"
                                    className={`w-full border ${errors.amount ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary/40'} rounded-xl py-3 px-4 pl-12 text-sm outline-none transition-colors bg-gray-50 focus:bg-white`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">ج.م</span>
                            </div>
                            {errors.amount && <p className="text-xs text-red-500 mt-1.5">{errors.amount}</p>}
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                يجب أن يكون المبلغ أقل من أو يساوي الرصيد المتاح ({formatCurrency(availableBalance)} ج.م)
                            </p>
                        </div>

                        {/* Method */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">طريقة السحب</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                                    className={`w-full border ${errors.method ? 'border-red-300' : 'border-gray-200'} rounded-xl py-3 px-4 text-sm text-right bg-gray-50 hover:bg-white transition-colors flex items-center justify-between outline-none`}
                                >
                                    <span className={selectedMethod ? 'text-gray-800' : 'text-gray-400'}>
                                        {selectedMethod ? (
                                            <span className="flex items-center gap-2">
                                                <selectedMethod.icon className="w-4 h-4" />
                                                {selectedMethod.label}
                                            </span>
                                        ) : 'اختر طريقة السحب'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showMethodDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showMethodDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                        {METHODS.map((m) => (
                                            <button
                                                key={m.value}
                                                type="button"
                                                onClick={() => {
                                                    setMethod(m.value);
                                                    setShowMethodDropdown(false);
                                                    setErrors(prev => ({ ...prev, method: undefined }));
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-right hover:bg-gray-50 transition-colors ${method === m.value ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'}`}
                                            >
                                                <m.icon className="w-5 h-5" />
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.method && <p className="text-xs text-red-500 mt-1.5">{errors.method}</p>}
                        </div>

                        {/* Account Details */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">بيانات التحويل</label>
                            <input
                                type="text"
                                value={accountDetails}
                                onChange={(e) => { setAccountDetails(e.target.value); setErrors(prev => ({ ...prev, accountDetails: undefined })); }}
                                placeholder="أدخل بيانات الحساب أو المحفظة"
                                className={`w-full border ${errors.accountDetails ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary/40'} rounded-xl py-3 px-4 text-sm outline-none transition-colors bg-gray-50 focus:bg-white`}
                            />
                            {errors.accountDetails && <p className="text-xs text-red-500 mt-1.5">{errors.accountDetails}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        جاري الإرسال...
                                    </span>
                                ) : 'إرسال الطلب'}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* slideUp animation */}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default WithdrawModal;

import React from 'react';

const OfferResultCard = ({ offer, error, onClose }) => {
    const isSuccess = !!offer && !error;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" dir="rtl">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up p-8 text-center relative">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6 mt-4">
                    {isSuccess ? (
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Title & Message */}
                <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? 'تم إرسال العرض بنجاح' : 'فشل إرسال العرض'}
                </h2>
                <p className="text-gray-500 mb-6">
                    {isSuccess 
                        ? 'تم إرسال عرضك للعميل بنجاح وسيتم إشعارك فور الرد عليه.'
                        : (error?.message || 'حدث خطأ غير متوقع أثناء محاولة إرسال العرض. يرجى المحاولة لاحقاً.')
                    }
                </p>

                {/* Details Card (Only on Success) */}
                {isSuccess && offer && (
                    <div className="bg-gray-50 rounded-2xl p-5 text-right border border-gray-100 mb-8 space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-500 text-sm">رقم العرض:</span>
                            <span className="font-bold text-gray-900">#{offer.offerId}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-500 text-sm">عنوان الطلب:</span>
                            <span className="font-bold text-gray-900 truncate max-w-[150px]">{offer.requestTitle || offer.legalServiceTitle || 'طلب خدمة'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">المبلغ المعروض:</span>
                            <span className="font-bold text-primary">{offer.offeredAmount} ج.م</span>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 px-4 rounded-xl font-bold transition-colors"
                >
                    متابعة
                </button>
            </div>
        </div>
    );
};

export default OfferResultCard;

import React from 'react';

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        return `اليوم، ${date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
        return 'أمس';
    } else {
        return `منذ ${diffInDays} أيام`;
    }
};

const LawyerRequestCard = ({ request, actions }) => {
    const { 
        title, 
        problemDetails, 
        serviceTitle, 
        price, 
        createdAt, 
        clientName, 
        clientProfileImage 
    } = request;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative transition-all duration-300 hover:shadow-md h-full">
            
            {/* Header: Client Info & Date */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                        {clientProfileImage ? (
                            <img src={clientProfileImage} alt={clientName} className="w-full h-full object-cover" />
                        ) : (
                            // Fallback to first letter
                            <span>{clientName ? clientName.charAt(0) : 'ع'}</span>
                        )}
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{clientName || 'عميل'}</h4>
                        <span className="text-xs text-gray-400 block mt-0.5" dir="rtl">
                            {formatTimeAgo(createdAt)}
                        </span>
                    </div>
                </div>

                {/* Badge (e.g. Service Type) */}
                {serviceTitle && (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        {serviceTitle}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="text-right flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title || 'طلب بدون عنوان'}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {problemDetails || 'لا يوجد وصف للطلب.'}
                </p>

                {/* Budget */}
                <div className="text-xs font-medium text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg inline-block self-start w-full">
                    ميزانية مقترحة: <span className="text-gray-900 mr-1">{price ? `${price} ج.م` : 'غير محدد'}</span>
                </div>
            </div>

            {/* Actions */}
            {actions && (
                <div className="flex gap-2 mt-auto border-t border-gray-100 pt-4">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default LawyerRequestCard;

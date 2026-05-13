import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcceptRequest, useRejectRequest } from '../../hooks/useLawyerRequests';

const RequestCard = ({ request }) => {
    const navigate = useNavigate();
    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectRequest();
    const isProcessing = isAccepting || isRejecting;

    const handleCardClick = () => {
        navigate('/lawyer-dashboard/requests', { state: { selectedRequest: request } });
    };

    const handleAccept = (e) => {
        e.stopPropagation();
        acceptRequest(request.id);
    };

    const handleReject = (e) => {
        e.stopPropagation();
        rejectRequest(request.id);
    };
    const getTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `منذ ${mins} دقيقة`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `منذ ${hours} ساعة`;
        return `منذ ${Math.floor(hours / 24)} يوم`;
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl border border-gray-100 p-5 min-w-[250px] max-w-[280px] flex-shrink-0 hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
            {/* Top: Time badge + avatar */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] text-gray-400 bg-gray-50 rounded-full px-2.5 py-1">
                    {getTimeAgo(request.createdAt)}
                </span>
                <img
                    src={request.clientProfileImage || `https://i.pravatar.cc/150?u=${request.clientId}`}
                    alt={request.clientName}
                    className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                />
            </div>

            {/* Client name */}
            <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{request.clientName}</h4>

            {/* Service type */}
            <p className="text-xs text-gray-500 mb-2 truncate">{request.serviceTitle}</p>

            {/* Budget */}
            <p className="text-xs text-gray-400 mb-4">
                الميزانية المتوقعة:{' '}
                <span className="font-semibold text-gray-700">{request.budget?.toLocaleString()} ج م</span>
            </p>

            {/* Location badge */}
            {request.location && (
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-4">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{request.location.governorate} - {request.location.city}</span>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors duration-200 disabled:opacity-70"
                >
                    قبول العرض
                </button>
                <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex-1 bg-white text-red-600 border border-red-200 hover:bg-red-50 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors duration-200 disabled:opacity-70"
                >
                    رفض
                </button>
            </div>
        </div>
    );
};

export default RequestCard;

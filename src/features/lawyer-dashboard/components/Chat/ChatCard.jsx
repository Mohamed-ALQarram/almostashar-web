import React from 'react';
import { usePresignedUrl } from '../..';

const caseTypeLabels = {
    Consultation: 'استشارة قانونية',
    Contract: 'عقد',
    CompanyFormation: 'تأسيس شركات',
    Lawsuit: 'قضية',
};

const ChatCard = ({ chat, isActive, onClick }) => {
    const { url: avatarUrl } = usePresignedUrl(chat.profileImage);
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        }
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const getLastMessagePreview = () => {
        if (chat.lastMessageType === 'Document') return '📎 مرفق';
        if (chat.lastMessageType === 'Image') return '🖼️ صورة';
        return chat.lastMessageContent || 'Encrypted message';
    };

    return (
        <button
            onClick={() => onClick(chat)}
            className={`w-full text-right p-4 flex items-center gap-3 transition-all duration-200 border-b border-gray-100 cursor-pointer ${isActive
                    ? 'bg-primary/5 border-r-4 border-r-gold'
                    : 'hover:bg-gray-50/80 border-r-4 border-r-transparent'
                }`}
            dir="rtl"
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={chat.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{chat.fullName?.charAt(0) || 'م'}</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{chat.fullName}</h4>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap mr-2 flex-shrink-0">
                        {formatTime(chat.lastMessageDate)}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{caseTypeLabels[chat.caseType] || chat.caseType}</p>
                <p className="text-xs text-gray-500 truncate">
                    {chat.isLastMessageFromMe && <span className="text-gray-400">أنت: </span>}
                    {getLastMessagePreview()}
                </p>
            </div>

            {/* Unread badge */}
            {chat.messagesCount > 0 && !chat.isLastMessageFromMe && (
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-gold text-white text-[10px] font-bold rounded-full px-1 flex-shrink-0">
                    {chat.messagesCount}
                </span>
            )}
        </button>
    );
};

export default ChatCard;

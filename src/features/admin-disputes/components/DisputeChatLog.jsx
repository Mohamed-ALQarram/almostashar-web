import React from 'react';
import { usePresignedUrl } from '../../admin-dashboard/hooks/useAdminDashboard';

// ─── Date / time formatters ────────────────────────────────────────
const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

const formatDatePill = (iso) => {
    const d = new Date(iso);
    return `بدأ النزاع بتاريخ ${d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}`;
};

// ─── Attachment bubble (centered, full-width) ──────────────────────
const AttachmentBubble = ({ attachment }) => {
    const { data: presigned } = usePresignedUrl(attachment?.filePath);

    return (
        <div className="flex justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 max-w-lg w-full">
                {/* Paperclip icon */}
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-sm text-gray-600">
                    قام المستشار بإرفاق ملف:{' '}
                    <a
                        href={presigned?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline cursor-pointer"
                    >
                        {attachment.fileName}
                    </a>
                </span>
            </div>
        </div>
    );
};

// ─── Single chat message ───────────────────────────────────────────
// sender: بيانات المرسل مشتقة من initiator أو respondent بناءً على senderId
// isInitiator: true لو المرسل هو اللي فتح النزاع (يظهر على اليسار)
const ChatMessage = ({ message, sender, isInitiator }) => {
    return (
        <div className={`flex items-start gap-3 ${isInitiator ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Avatar */}
            <img
                src={sender.avatar}
                alt={sender.name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />

            {/* Bubble column */}
            <div className={`flex flex-col ${isInitiator ? 'items-start' : 'items-end'} max-w-lg`}>
                {/* Sender name + role */}
                <span className="text-xs text-gray-500 mb-1">
                    {sender.name} · {sender.role}
                </span>

                {/* Bubble */}
                <div
                    className={`px-4 py-3 text-sm leading-relaxed ${isInitiator
                        ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm'
                        : 'bg-primary text-white rounded-2xl rounded-tl-sm'
                        }`}
                >
                    {message.content}
                </div>

                {/* Timestamp — API field: sentAt */}
                <span className="text-xs text-gray-400 mt-1">{formatTime(message.sentAt)}</span>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// Props:
//   messages   ← dispute.disputeChatMessages  [{ senderId, content, sentAt }]
//   initiator  ← dispute.initiator            { id, name, avatar, role }
//   respondent ← dispute.respondent           { id, name, avatar, role }
const DisputeChatLog = ({ messages = [], initiator = null, respondent = null }) => {
    const firstTimestamp = messages[0]?.sentAt;

    // بناء map سريع: userId → { partyData, isInitiator }
    const resolveParty = (senderId) => {
        if (initiator && senderId === initiator.id)
            return { sender: initiator, isInitiator: true };
        if (respondent && senderId === respondent.id)
            return { sender: respondent, isInitiator: false };
        // fallback لو الـ id مش متطابق
        return {
            sender: { name: `مستخدم #${senderId}`, avatar: '', role: '' },
            isInitiator: true,
        };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Chat icon */}
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h2 className="font-bold text-lg text-primary">سجل المحادثة</h2>
                </div>

                <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    عرض جميع الرسائل
                </button>
            </div>

            {/* ── Body ────────────────────────────────────────── */}
            <div className="p-6">
                {/* Date separator pill */}
                {firstTimestamp && (
                    <div className="flex justify-center mb-6">
                        <span className="bg-gray-100 text-gray-500 text-xs px-4 py-1.5 rounded-full">
                            {formatDatePill(firstTimestamp)}
                        </span>
                    </div>
                )}

                {/* Messages */}
                <div className="space-y-6">
                    {messages.map((msg, index) => {
                        // Attachment-only message (no content)
                        if (msg.attachment && !msg.content) {
                            return <AttachmentBubble key={msg.id ?? index} attachment={msg.attachment} />;
                        }

                        const { sender, isInitiator } = resolveParty(msg.senderId);
                        return (
                            <ChatMessage
                                key={msg.id ?? index}
                                message={msg}
                                sender={sender}
                                isInitiator={isInitiator}
                            />
                        );
                    })}

                    {messages.length === 0 && (
                        <p className="text-center text-sm text-gray-400 py-8">لا توجد رسائل بعد</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisputeChatLog;

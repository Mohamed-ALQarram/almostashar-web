import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    useChatDevices,
    useChatMessages,
    useEncryptedDocument,
    usePresignedUrl,
    useSendMessage,
    useTypingIndicator,
} from '../..';
import { useAuthStore } from '../../../auth';
import { useChatStore } from '../../store/chatStore';
import { markMessagesAsRead } from '../../api/lawyerDashboardApi';

const caseTypeLabels = {
    Consultation: 'استشارة قانونية',
    Contract: 'عقد',
    CompanyFormation: 'تأسيس شركات',
    Lawsuit: 'قضية',
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo',
    });
};

const SeenIcon = ({ isSeen }) => (
    <svg className={`w-4 h-4 ${isSeen ? 'text-blue-300' : 'text-white/40'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 13l4 4L14 7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13l4 4L21 7" />
    </svg>
);

const MessageMeta = ({ sentAt, isMine, isSeen }) => (
    <div className={`flex items-center gap-1 mt-1.5 ${isMine ? 'justify-start' : 'justify-end'}`}>
        <span className={`text-[10px] ${isMine ? 'text-white/50' : 'text-gray-400'}`}>
            {formatTime(sentAt)}
        </span>
        {isMine && <SeenIcon isSeen={isSeen} />}
    </div>
);

const MediaLoading = ({ isMine }) => (
    <div className={`flex ${isMine ? 'justify-start' : 'justify-end'} mb-3`}>
        <div className={`w-48 h-14 rounded-2xl animate-pulse ${isMine ? 'bg-primary/20 mr-auto' : 'bg-gray-200 ml-auto'}`} />
    </div>
);

const DocumentBubble = ({ message, isMine }) => {
    const encryptedDocument = useEncryptedDocument(message);
    const legacyDocument = usePresignedUrl(message.document ? null : message.documentUrl);
    const url = message.document ? encryptedDocument.url : legacyDocument.url;
    const isLoading = message.document ? encryptedDocument.isLoading : legacyDocument.isLoading;
    const documentName = encryptedDocument.name || message.documentName || 'Encrypted document';

    if (isLoading) return <MediaLoading isMine={isMine} />;

    return (
        <div className={`flex ${isMine ? 'justify-start' : 'justify-end'} mb-3`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMine ? 'bg-primary text-white rounded-bl-sm' : 'bg-gray-100 text-gray-900 rounded-br-sm'}`}>
                {message.content && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
                        {message.content}
                    </p>
                )}
                <a
                    href={url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm ${isMine ? 'text-white/90 hover:text-white' : 'text-primary hover:text-primary-dark'}`}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{documentName}</span>
                </a>
                {encryptedDocument.error && (
                    <p className={`text-[11px] mt-2 ${isMine ? 'text-white/60' : 'text-red-500'}`}>
                        Unable to decrypt document on this device.
                    </p>
                )}
                <MessageMeta sentAt={message.sentAt} isMine={isMine} isSeen={message.isSeen} />
            </div>
        </div>
    );
};

const ImageBubble = ({ message, isMine }) => {
    const encryptedDocument = useEncryptedDocument(message);
    const legacyDocument = usePresignedUrl(message.document ? null : message.documentUrl);
    const url = message.document ? encryptedDocument.url : legacyDocument.url;
    const isLoading = message.document ? encryptedDocument.isLoading : legacyDocument.isLoading;

    if (isLoading) {
        return (
            <div className={`flex ${isMine ? 'justify-start' : 'justify-end'} mb-3`}>
                <div className={`w-52 h-40 rounded-2xl animate-pulse ${isMine ? 'bg-primary/20' : 'bg-gray-200'}`} />
            </div>
        );
    }

    return (
        <div className={`flex ${isMine ? 'justify-start' : 'justify-end'} mb-3`}>
            <div className={`max-w-[65%] rounded-2xl overflow-hidden ${isMine ? 'bg-primary rounded-bl-sm' : 'bg-gray-100 rounded-br-sm'}`}>
                {url ? (
                    <img
                        src={url}
                        alt="صورة"
                        className="w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                    />
                ) : (
                    <div className={`px-4 py-6 text-sm ${isMine ? 'text-white/70' : 'text-red-500'}`}>
                        Unable to decrypt image on this device.
                    </div>
                )}
                <MessageMeta sentAt={message.sentAt} isMine={isMine} isSeen={message.isSeen} />
            </div>
        </div>
    );
};

const getFallbackText = (status) => ({
    'missing-key': 'This message was not encrypted for this device.',
    'missing-sender-device': 'Unable to find sender device key.',
    failed: 'Unable to decrypt this message.',
    'encrypted-pending': 'Decrypting message...',
}[status]);

const MessageBubble = ({ message, isMine }) => {
    const hasDocument = message.documentUrl || message.document;

    if ((message.messageType === 'Document' || message.messageType === 'TextWithAttachment') && hasDocument) {
        return <DocumentBubble message={message} isMine={isMine} />;
    }
    if (message.messageType === 'Image' && hasDocument) {
        return <ImageBubble message={message} isMine={isMine} />;
    }

    return (
        <div className={`flex ${isMine ? 'justify-start' : 'justify-end'} mb-3`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMine
                    ? 'bg-primary text-white rounded-bl-sm'
                    : 'bg-gray-100 text-gray-900 rounded-br-sm'
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {getFallbackText(message.decryptionStatus) || message.content}
                </p>
                <MessageMeta sentAt={message.sentAt} isMine={isMine} isSeen={message.isSeen} />
            </div>
        </div>
    );
};

const EmptyChat = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FB] text-center p-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-400 mb-2">لا يوجد محادثة محددة</h3>
        <p className="text-sm text-gray-300">اختر محادثة من القائمة لبدء المحادثة</p>
    </div>
);

const TypingDots = () => (
    <div className="flex justify-end mb-3">
        <div className="bg-gray-100 rounded-2xl rounded-br-sm px-4 py-3 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    </div>
);

const FilePreview = ({ file, onRemove }) => {
    const isImage = file.type && file.type.startsWith('image/');

    return (
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 mx-3 mb-2" dir="rtl">
            {isImage ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
            ) : (
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            )}
            <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
            <button
                onClick={onRemove}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const ChatArea = ({ activeChat }) => {
    const { user } = useAuthStore();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: messagesData, isLoading } = useChatMessages(activeChat?.chatId);
    const { data: devicesState } = useChatDevices(activeChat?.chatId);
    const { url: headerAvatarUrl } = usePresignedUrl(activeChat?.profileImage);
    const { sendMessage, isSending, error: sendError, clearError } = useSendMessage();
    const { emitTyping, stopTyping } = useTypingIndicator(activeChat?.chatId, activeChat?.userId);

    const typingUser = useChatStore((s) => s.typingUsers[activeChat?.chatId]);
    const setActiveChatId = useChatStore((s) => s.setActiveChatId);

    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const rawMessages = useMemo(
        () => messagesData?.items || (Array.isArray(messagesData) ? messagesData : []),
        [messagesData]
    );
    const messages = useMemo(() => [...rawMessages].reverse(), [rawMessages]);
    const keyChangedWarning = devicesState?.warnings?.find((warning) => warning.type === 'key-changed');
    const newDeviceNotice = devicesState?.warnings?.find((warning) => warning.type === 'new-device');

    useEffect(() => {
        setActiveChatId(activeChat?.chatId || null);
        return () => setActiveChatId(null);
    }, [activeChat?.chatId, setActiveChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    useEffect(() => {
        if (!activeChat?.chatId || !rawMessages.length || !user?.id) return;

        const lastUnreadFromOther = rawMessages.find(
            (m) => m.senderId !== user.id && !m.isSeen
        );

        if (lastUnreadFromOther) {
            markMessagesAsRead(activeChat.chatId, lastUnreadFromOther.messageId)
                .then(() => queryClient.invalidateQueries({ queryKey: ['chats'] }))
                .catch((err) => console.warn('[MarkRead] failed:', err));
        }
    }, [activeChat?.chatId, rawMessages, user?.id, queryClient]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setInputValue('');
            setSelectedFile(null);
            clearError();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [activeChat?.chatId, clearError]);

    const handleSend = async () => {
        const text = inputValue.trim();
        if (!text && !selectedFile) return;
        if (!activeChat) return;

        try {
            await sendMessage({
                chatId: activeChat.chatId,
                receiverId: activeChat.userId,
                content: text,
                file: selectedFile,
            });

            setInputValue('');
            setSelectedFile(null);
            stopTyping();
        } catch {
            // Error is surfaced in the send error banner.
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        emitTyping();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
        e.target.value = '';
    };

    if (!activeChat) return <EmptyChat />;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FB] min-w-0">
            <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0" dir="rtl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden flex-shrink-0">
                        {headerAvatarUrl ? (
                            <img src={headerAvatarUrl} alt={activeChat.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <span>{activeChat.fullName?.charAt(0) || 'م'}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-900">{activeChat.fullName}</h3>
                        <p className="text-xs text-gray-400">
                            {typingUser ? (
                                <span className="text-gold animate-pulse">يكتب...</span>
                            ) : (
                                caseTypeLabels[activeChat.caseType] || activeChat.caseType
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4" dir="rtl">
                {keyChangedWarning && (
                    <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        Peer device key changed. Sending to that device is blocked until it is reviewed.
                    </div>
                )}
                {!keyChangedWarning && newDeviceNotice && (
                    <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                        A new peer device was detected. Future messages may be readable on that device.
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col gap-3 animate-pulse">
                        <div className="flex justify-end"><div className="h-10 w-48 bg-primary/10 rounded-2xl" /></div>
                        <div className="flex justify-start"><div className="h-10 w-56 bg-gray-200 rounded-2xl" /></div>
                        <div className="flex justify-end"><div className="h-10 w-40 bg-primary/10 rounded-2xl" /></div>
                        <div className="flex justify-start"><div className="h-16 w-64 bg-gray-200 rounded-2xl" /></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-sm text-gray-400">لا توجد رسائل بعد</p>
                        <p className="text-xs text-gray-300 mt-1">ابدأ المحادثة بإرسال رسالة</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.messageId}
                            message={msg}
                            isMine={msg.senderId === user?.id}
                        />
                    ))
                )}
                {typingUser && <TypingDots />}
                <div ref={messagesEndRef} />
            </div>

            {selectedFile && (
                <FilePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
            )}

            {sendError && (
                <div className="mx-3 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2" dir="rtl">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">{sendError}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600">x</button>
                </div>
            )}

            <div className="bg-white border-t border-gray-100 p-3 flex-shrink-0" dir="rtl">
                <div className="flex items-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                        onChange={handleFileSelect}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                        className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors flex-shrink-0 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك..."
                        disabled={isSending}
                        className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-gold/30 rounded-xl py-3 px-4 text-sm text-gray-700 transition-colors outline-none disabled:opacity-50"
                    />

                    <button
                        onClick={handleSend}
                        disabled={isSending || (!inputValue.trim() && !selectedFile)}
                        className="p-2.5 bg-gold hover:bg-gold-dark text-white rounded-xl transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;

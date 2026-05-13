import React, { useState } from 'react';
import { useChats } from '../hooks/useLawyerDashboard';
import ChatCard from './ChatCard';

const ChatList = ({ activeChatId, onChatSelect }) => {
    const [search, setSearch] = useState('');
    const { data: chatsData, isLoading } = useChats(search ? { Search: search } : {});

    const chats = chatsData?.items || (Array.isArray(chatsData) ? chatsData : []);

    return (
        <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 flex flex-col h-full flex-shrink-0" dir="rtl">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث في المحادثات..."
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gold/30 rounded-xl py-2.5 px-4 pl-10 text-sm text-gray-700 transition-colors outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Chat items */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 animate-pulse flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="h-3.5 bg-gray-100 rounded w-24 mb-2" />
                                    <div className="h-3 bg-gray-50 rounded w-36" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-gray-400 text-sm">
                            {search ? 'لا توجد نتائج' : 'لا توجد محادثات'}
                        </p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <ChatCard
                            key={chat.chatId}
                            chat={chat}
                            isActive={activeChatId === chat.chatId}
                            onClick={onChatSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;

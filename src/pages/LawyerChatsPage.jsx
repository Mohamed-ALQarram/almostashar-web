import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LawyerSidebar,
    ChatList,
    ChatArea,
    useLawyerSidebarStore,
    useChatSignalR
} from '../features/lawyer-dashboard';

const LawyerChatsPage = () => {
    const location = useLocation();
    const [activeChat, setActiveChat] = useState(null);
    const [showChatList, setShowChatList] = useState(true);
    const { setOpen } = useLawyerSidebarStore();

    // Start SignalR hub and subscribe to real-time events
    useChatSignalR();

    // Auto-select chat when navigating from Cases page
    useEffect(() => {
        if (location.state?.selectedChat) {
            setActiveChat(location.state.selectedChat);
            if (window.innerWidth < 768) {
                setShowChatList(false);
            }
        }
    }, [location.state]);

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        // On mobile, hide the chat list when a chat is selected
        if (window.innerWidth < 768) {
            setShowChatList(false);
        }
    };

    const handleBackToList = () => {
        setShowChatList(true);
        setActiveChat(null);
    };

    return (
        <div className="min-h-screen h-screen bg-[#F8F9FB] flex overflow-hidden" dir="rtl">
            {/* Sidebar — always collapsed on chats page */}
            <LawyerSidebar collapsed={true} />

            {/* Main chat area — offset by collapsed sidebar width */}
            <div className="flex-1 flex h-screen mr-0 lg:mr-20 min-w-0">
                {/* Chat List Panel */}
                <div className={`${showChatList ? 'flex' : 'hidden'} md:flex h-full flex-shrink-0`}>
                    <ChatList
                        activeChatId={activeChat?.chatId}
                        onChatSelect={handleChatSelect}
                    />
                </div>

                {/* Chat Area */}
                <div className={`${!showChatList || activeChat ? 'flex' : 'hidden'} md:flex flex-1 h-full min-w-0`}>
                    {/* Mobile back button */}
                    {!showChatList && activeChat && (
                        <button
                            onClick={handleBackToList}
                            className="md:hidden absolute top-4 right-24 z-20 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-primary transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    <ChatArea activeChat={activeChat} />
                </div>
            </div>
        </div>
    );
};

export default LawyerChatsPage;

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useNotifications, useMarkNotificationsAsRead } from '../hooks/useLawyerDashboard';

const LawyerHeader = ({ onMenuToggle }) => {
    const { user } = useAuthStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const { data: notificationsData } = useNotifications({ pageSize: 5 });
    const { mutate: markAsRead } = useMarkNotificationsAsRead();

    const notifications = Array.isArray(notificationsData)
        ? notificationsData
        : (notificationsData?.data || notificationsData?.items || []);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleBellClick = () => {
        setShowNotifications((prev) => !prev);
    };

    const handleMarkAllRead = () => {
        markAsRead(undefined);
        setShowNotifications(false);
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
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30" dir="rtl">
            {/* Right: Hamburger + page info */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Center: Search */}
            <div className="relative hidden md:block flex-1 max-w-md mx-4">
                <input
                    type="text"
                    placeholder="ابحث عن قضية, رقم 123, العميل / ..."
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-muted/30 focus:ring-0 rounded-full py-2.5 px-5 pl-10 text-sm text-gray-700 transition-colors outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Left: Notifications + User */}
            <div className="flex items-center gap-4">
                {/* Online status */}
                <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                    </svg>
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={handleBellClick}
                        className="relative p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-full"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full px-1 border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {showNotifications && (
                        <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-sm text-primary">الإشعارات</h3>
                                {unreadCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="text-xs text-gold hover:text-gold-dark transition-colors">
                                        تحديد الكل كمقروء
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                {notifications.length === 0 ? (
                                    <p className="p-6 text-center text-gray-400 text-sm">لا توجد إشعارات</p>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-gold/5' : ''}`}>
                                            <p className="text-sm font-medium text-gray-800">{n.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.description}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{getTimeAgo(n.createdAt)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User greeting */}
                <div className="flex items-center gap-3 pr-3 border-r border-gray-100">
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-primary leading-tight">مرحباً أ/ {user?.firstName + ' ' + user?.lastName || 'أحمد'}</p>
                        <p className="text-xs text-gray-400">{user?.email || 'أحمد عبدالعاطي'}</p>
                    </div>
                    <img
                        src={user?.avatar || 'https://i.pravatar.cc/150?u=lawyer_avatar'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                    />
                </div>
            </div>
        </header>
    );
};

export default LawyerHeader;

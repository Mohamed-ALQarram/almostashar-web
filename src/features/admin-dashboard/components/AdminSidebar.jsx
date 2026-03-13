import React from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    const menuItems = [
        { label: 'لوحة القيادة', icon: 'dashboard', path: '/admin' },
        { label: 'التحقق', icon: 'shield-check', path: '/admin/verification' },
        { label: 'المالية', icon: 'cash', path: '#' },
        { label: 'النزاعات', icon: 'exclamation-circle', badge: 3, path: '#' },
        { label: 'المستخدمين', icon: 'users', path: '#' },
        { label: 'التحليلات', icon: 'chart-bar', path: '#' },
    ];

    return (
        <aside className="w-64 bg-primary text-white flex flex-col h-screen fixed right-0 top-0 overflow-y-auto z-20" dir="rtl">
            {/* Brand area */}
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gold/20 flex items-center justify-center text-gold">
                    {/* Logo icon placeholder */}
                    <span className="text-xl leading-none">∆</span>
                </div>
                <div>
                    <h2 className="font-bold text-lg leading-tight">منصة الاستشارات</h2>
                    <p className="text-white/60 text-xs">لوحة الإدارة</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive
                                ? 'bg-white/10 text-gold font-medium'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {/* Simple SVG Icons based on item.icon for visualization */}
                            {item.icon === 'dashboard' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            )}
                            {item.icon === 'shield-check' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            )}
                            {item.icon === 'cash' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            )}
                            {item.icon === 'exclamation-circle' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                            {item.icon === 'users' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                            {item.icon === 'chart-bar' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            )}

                            <span>{item.label}</span>

                            {item.badge && (
                                <span className="absolute left-4 bg-error text-white text-xs w-5 h-5 flex items-center justify-center rounded-full leading-none">
                                    {item.badge}
                                </span>
                            )}

                            {/* Active indicator line */}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-l-full"></div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Settings & Profile */}
            <div className="p-4 mt-auto border-t border-white/10 space-y-2">
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>الإعدادات</span>
                </a>

                <div className="flex items-center gap-3 p-3 mt-4 bg-primary-light/30 rounded-lg">
                    <img src={user?.avatar || "https://i.pravatar.cc/150?u=admin_avatar"} alt="Admin Profile" className="w-10 h-10 rounded-full border-2 border-gold/50" />
                    <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-sm truncate">{user?.name || "أحمد العلي"}</h4>
                        <p className="text-white/60 text-xs truncate">مدير النظام</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;

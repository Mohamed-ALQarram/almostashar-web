import React, { useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLawyerSidebarStore } from '../store/lawyerSidebarStore';

// ─── Icon Components ────────────────────────────────────────────────
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const CasesIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ChatIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const ServicesIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const RequestsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
);
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const PlusCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ContractIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const WalletIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
const CollapseIcon = ({ flipped }) => (
    <svg className={`w-5 h-5 transition-transform duration-300 ${flipped ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
);

const menuItems = [
    { label: 'الرئيسية', icon: <HomeIcon />, path: '/lawyer-dashboard' },
    { label: 'قضاياي', icon: <CasesIcon />, path: '#' },
    { label: 'محادثاتي', icon: <ChatIcon />, path: '/lawyer-dashboard/chats' },
    { label: 'خدماتي', icon: <ServicesIcon />, path: '#' },
    { label: 'الطلبات والفرص', icon: <RequestsIcon />, path: '#' },
    { label: 'المواعيد', icon: <CalendarIcon />, path: '#' },
    { label: 'لوحة التحكم', icon: <DashboardIcon />, path: '#' },
];

const shortcuts = [
    { label: 'إنشاء قضية', icon: <PlusCircleIcon />, action: '#' },
    { label: 'إنشاء عقد', icon: <ContractIcon />, action: '#' },
    { label: 'تحديد موعد', icon: <ClockIcon />, action: '#' },
    { label: 'سحب رصيد', icon: <WalletIcon />, action: '#' },
];

// ─── Tooltip (collapsed mode) ──────────────────────────────────────
const Tooltip = ({ label }) => (
    <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {label}
    </div>
);

// ─── Main Component ────────────────────────────────────────────────
const LawyerSidebar = ({ collapsed: collapsedProp }) => {
    const { logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { isOpen, close, isCollapsed: storeCollapsed, toggleCollapse } = useLawyerSidebarStore();

    const isCollapsed = collapsedProp !== undefined ? collapsedProp : storeCollapsed;
    const [shortcutsOpen, setShortcutsOpen] = useState(true);

    const handleLogout = () => { logout(); navigate('/guest'); };

    const linkCls = (active) =>
        `flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all duration-200 relative group ${
            active ? 'bg-gold/10 text-gold font-medium shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white'
        }`;

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/40 z-[35] lg:hidden" onClick={close} />}

            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} bg-primary text-white flex flex-col h-screen fixed right-0 top-0 overflow-y-auto z-40 transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'max-lg:translate-x-full'}`}
                dir="rtl"
            >
                {/* Brand */}
                <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-white/10 flex items-center gap-3`}>
                    <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-sm leading-tight truncate">منصة المستشار</h2>
                            <p className="text-white/50 text-xs truncate">لوحة المحامين</p>
                        </div>
                    )}
                    <button onClick={close} className="lg:hidden p-1 text-white/60 hover:text-white transition-colors mr-auto">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Nav items */}
                <nav className={`flex-1 py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
                    {menuItems.map((item, i) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={i} to={item.path} onClick={close} title={isCollapsed ? item.label : undefined} className={linkCls(active)}>
                                <span className="flex-shrink-0">{item.icon}</span>
                                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                                {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-l-full" />}
                                {isCollapsed && <Tooltip label={item.label} />}
                            </Link>
                        );
                    })}

                    {/* Shortcuts */}
                    <div className="pt-4 mt-4 border-t border-white/10">
                        <button
                            onClick={() => setShortcutsOpen((prev) => !prev)}
                            className={`flex items-center gap-2 w-full ${isCollapsed ? 'justify-center' : 'px-4'} mb-1 cursor-pointer group`}
                        >
                            {!isCollapsed ? (
                                <>
                                    <span className="text-xs font-semibold text-gold border border-gold/30 rounded-full px-3 py-1 group-hover:bg-gold/10 transition-colors">
                                        إختصارات
                                    </span>
                                    <svg
                                        className={`w-3.5 h-3.5 text-gold/60 mr-auto transition-transform duration-300 ${shortcutsOpen ? 'rotate-0' : '-rotate-90'}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            ) : (
                                <span className="text-gold group-hover:text-gold-light transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                shortcutsOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                            }`}
                        >
                            {shortcuts.map((item, i) => (
                                <Link key={`s-${i}`} to={item.action} onClick={close} title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/5 hover:text-white relative group`}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                                    {isCollapsed && <Tooltip label={item.label} />}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className={`${isCollapsed ? 'p-2' : 'p-4'} mt-auto border-t border-white/10 space-y-1`}>
                    <Link to="#" title={isCollapsed ? 'الإعدادات' : undefined}
                        className={`flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors relative group`}
                    >
                        <SettingsIcon />
                        {!isCollapsed && <span className="text-sm">الإعدادات</span>}
                        {isCollapsed && <Tooltip label="الإعدادات" />}
                    </Link>
                    <button onClick={handleLogout} title={isCollapsed ? 'تسجيل الخروج' : undefined}
                        className={`w-full flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors relative group`}
                    >
                        <LogoutIcon />
                        {!isCollapsed && <span className="text-sm">تسجيل الخروج</span>}
                        {isCollapsed && <Tooltip label="تسجيل الخروج" />}
                    </button>
                </div>

                {/* Collapse toggle — desktop only */}
                <button onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center p-3 border-t border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
                >
                    <CollapseIcon flipped={isCollapsed} />
                </button>
            </aside>
        </>
    );
};

export default LawyerSidebar;

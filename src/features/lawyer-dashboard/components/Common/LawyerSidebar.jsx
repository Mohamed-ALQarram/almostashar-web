import React, { useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLawyerSidebarStore } from '../../store/lawyerSidebarStore';
import logo from '../../../../assets/AlMostashar-logo.png';

import {
    Home, FileText, MessageCircle, Briefcase, Archive,
    LayoutGrid, PlusCircle, Wallet, Settings, LogOut,
    ChevronsLeft, X, ChevronDown, Zap
} from 'lucide-react';

const ICON_CLASS = 'w-5 h-5';

const menuItems = [
    { label: 'الرئيسية', icon: <Home className={ICON_CLASS} />, path: '/lawyer-dashboard' },
    { label: 'قضاياي', icon: <FileText className={ICON_CLASS} />, path: '/lawyer-dashboard/cases' },
    { label: 'محادثاتي', icon: <MessageCircle className={ICON_CLASS} />, path: '/lawyer-dashboard/chats' },
    { label: 'خدماتي', icon: <Briefcase className={ICON_CLASS} />, path: '/lawyer-dashboard/services' },
    { label: 'طلباتي', icon: <Archive className={ICON_CLASS} />, path: '/lawyer-dashboard/requests' },
    { label: 'فرص المناقصات', icon: <Archive className={ICON_CLASS} />, path: '/lawyer-dashboard/tenders' },
    { label: 'محفظتي', icon: <Wallet className={ICON_CLASS} />, path: '/lawyer-dashboard/wallet' },
];

const shortcuts = [
    { label: 'إنشاء قضية', icon: <PlusCircle className={ICON_CLASS} />, action: '#' },
    { label: 'سحب رصيد', icon: <Wallet className={ICON_CLASS} />, action: '#' },
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
        `flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl transition-all duration-200 relative group ${active ? 'bg-gold/10 text-gold font-medium shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white'
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
                    <img
                        src={logo}
                        alt="منصة المستشار"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-gold/30"
                    />
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-sm leading-tight truncate">منصة المستشار</h2>
                            <p className="text-white/50 text-xs truncate">لوحة المحامين</p>
                        </div>
                    )}
                    <button onClick={close} className="lg:hidden p-1 text-white/60 hover:text-white transition-colors mr-auto">
                        <X className={ICON_CLASS} />
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
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 text-gold/60 mr-auto transition-transform duration-300 ${shortcutsOpen ? 'rotate-0' : '-rotate-90'}`}
                                    />
                                </>
                            ) : (
                                <span className="text-gold group-hover:text-gold-light transition-colors">
                                    <Zap className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${shortcutsOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
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
                        <Settings className={ICON_CLASS} />
                        {!isCollapsed && <span className="text-sm">الإعدادات</span>}
                        {isCollapsed && <Tooltip label="الإعدادات" />}
                    </Link>
                    <button onClick={handleLogout} title={isCollapsed ? 'تسجيل الخروج' : undefined}
                        className={`w-full flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors relative group`}
                    >
                        <LogOut className={ICON_CLASS} />
                        {!isCollapsed && <span className="text-sm">تسجيل الخروج</span>}
                        {isCollapsed && <Tooltip label="تسجيل الخروج" />}
                    </button>
                </div>

                {/* Collapse toggle — desktop only */}
                <button onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center p-3 border-t border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
                >
                    <ChevronsLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </aside>
        </>
    );
};

export default LawyerSidebar;

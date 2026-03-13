import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title = 'لوحة القيادة', breadcrumbs = [] }) => {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10" dir="rtl">
            {/* Page Title & Breadcrumbs */}
            <div>
                <h1 className="text-xl font-bold text-primary">{title}</h1>
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center text-sm mt-1">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {crumb.path ? (
                                    <Link to={crumb.path} className="text-gray-500 hover:text-primary transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400">{crumb.label}</span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <span className="mx-2 text-gray-300">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
            </div>

            {/* Right side: Search & Notifications */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="بحث عام..."
                        className="w-64 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-muted/30 focus:ring-0 rounded-full py-2 px-4 pl-10 text-sm text-gray-700 transition-colors outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;

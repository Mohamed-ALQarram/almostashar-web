import React from 'react';
import { useOpenDisputes } from '../hooks/useAdminDashboard';

const OpenDisputes = () => {
    const { data: disputes, isLoading } = useOpenDisputes();

    if (isLoading) {
        return <div className="h-48 bg-white rounded-2xl shadow-sm animate-pulse mb-8"></div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h2 className="font-bold text-gray-900">النزاعات المفتوحة</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-400 bg-gray-50/50 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium">رقم التذكرة</th>
                            <th scope="col" className="px-6 py-4 font-medium">المشكلة</th>
                            <th scope="col" className="px-6 py-4 font-medium text-center">الحالة</th>
                            <th scope="col" className="px-6 py-4 font-medium text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {disputes?.map((dispute, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                    {dispute.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {dispute.issue}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${dispute.statusColor === 'warning' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${dispute.statusColor === 'warning' ? 'bg-warning' : 'bg-error'
                                            }`}></span>
                                        {dispute.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-3 text-gray-400">
                                        <button className="hover:text-primary transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                        <button className="hover:text-primary transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        </button>
                                        <button className="hover:text-error transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {disputes?.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">لا توجد نزاعات مفتوحة</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OpenDisputes;

import React from 'react';
import { usePresignedUrl } from '../../admin-dashboard/hooks/useAdminDashboard';

const DocumentPreviewModal = ({ title, filePath, onClose }) => {
    const { data, isLoading, isError } = usePresignedUrl(filePath);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <div className="bg-brand-page w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-primary text-white">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="إغلاق"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4 text-brand-muted">
                            <svg className="animate-spin h-8 w-8 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="font-medium animate-pulse">جاري تحميل المستند...</p>
                        </div>
                    ) : isError || !data?.url ? (
                        <div className="flex flex-col items-center gap-3 text-error bg-red-50 p-6 rounded-xl border border-red-100">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="font-bold">عذراً، تعذر تحميل المستند</p>
                            <p className="text-sm text-red-700">قد يكون الرابط منتهي الصلاحية أو الملف غير موجود.</p>
                        </div>
                    ) : (
                        // Document Viewer
                        <div className="w-full flex-1 flex flex-col items-center gap-4">
                            {/* Simple check if PDF vs Image based on response or file extension, defaulting to image tag for now */}
                            {data.url.toLowerCase().includes('.pdf?') ? (
                                <iframe
                                    src={`${data.url}#toolbar=0`}
                                    className="w-full h-[60vh] rounded-xl border border-gray-200 shadow-sm"
                                    title={title}
                                />
                            ) : (
                                <img
                                    src={data.url}
                                    alt={title}
                                    className="max-w-full max-h-[60vh] object-contain rounded-xl border border-gray-200 shadow-sm"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-colors min-w-[120px]"
                    >
                        إغلاق
                    </button>

                    {data?.url && (
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-gold transition-colors text-sm font-semibold"
                        >
                            فتح في نافذة جديدة
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;

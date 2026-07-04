import React from 'react';
import { usePresignedUrl } from '../../documents/hooks/usePresignedUrl';

// ─── Infer file type from path or extension ────────────────────────
const inferFileType = (path = '', name = '') => {
    const str = (path + name).toLowerCase();
    if (str.startsWith('images/') || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(str)) return 'image';
    if (/\.(pdf)$/.test(str)) return 'pdf';
    return 'document';
};

// ─── Format bytes to human-readable size ──────────────────────────
const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── File-type icon config ─────────────────────────────────────────
const FILE_TYPE_CONFIG = {
    image: {
        containerClass: 'text-success bg-success/10',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    document: {
        containerClass: 'text-primary bg-primary/10',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    pdf: {
        containerClass: 'text-error bg-error/10',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h2m-2 3h4" />
            </svg>
        ),
    },
};

// ─── AttachmentCard (inner) ────────────────────────────────────────
// API shape: { name, size (bytes), path }
const AttachmentCard = ({ attachment }) => {
    // `path` is the relative storage path used to get a presigned URL
    const { data } = usePresignedUrl(attachment.path);

    const fileType = inferFileType(attachment.path, attachment.name);
    const typeConfig = FILE_TYPE_CONFIG[fileType] || FILE_TYPE_CONFIG.document;

    const handleClick = () => {
        if (data?.url) {
            window.open(data.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            onClick={handleClick}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
        >
            {/* File type icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${typeConfig.containerClass}`}>
                {typeConfig.icon}
            </div>

            {/* File name */}
            <p className="text-sm font-medium text-gray-800 mb-1 truncate max-w-full">
                {attachment.name}
            </p>

            {/* File size */}
            <span className="text-xs text-gray-400">
                {formatSize(attachment.size)}
            </span>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
const DisputeAttachments = ({ attachments = [] }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50" dir="rtl">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <h2 className="font-bold text-lg text-primary">المرفقات والمستندات</h2>
            </div>

            {/* ── Attachments grid / empty state ───────────────── */}
            {attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {attachments.map((attachment, index) => (
                        <AttachmentCard key={attachment.path || index} attachment={attachment} />
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-gray-400">
                    لا توجد مرفقات
                </div>
            )}
        </div>
    );
};

export default DisputeAttachments;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import DisputeAdminActions from '../features/admin-disputes/components/DisputeAdminActions';
import DisputeChatLog from '../features/admin-disputes/components/DisputeChatLog';
import DisputeAttachments from '../features/admin-disputes/components/DisputeAttachments';
import {
    useDisputeDetail,
    useResolveDispute,
} from '../features/admin-disputes/hooks/useDisputeDetail';

// ─── Status map ────────────────────────────────────────────────────
const STATUS_MAP = {
    Open: { label: 'مفتوحة', color: 'error' },
    UnderReview: { label: 'قيد المراجعة', color: 'warning' },
    AwaitingClientResponse: { label: 'بانتظار رد العميل', color: 'primary' },
    AwaitingLawyerResponse: { label: 'بانتظار رد المحامي', color: 'primary' },
    ResolvedRelease: { label: 'تم الحل - إفراج', color: 'success' },
    ResolvedRefund: { label: 'تم الحل - استرداد', color: 'success' },
    Dismissed: { label: 'مرفوض', color: 'gray' },
};

const getStatusClasses = (color) => {
    const map = {
        error: 'bg-error/10 text-error',
        warning: 'bg-warning/10 text-warning',
        success: 'bg-success/10 text-success',
        primary: 'bg-primary/10 text-primary',
        gray: 'bg-gray-100 text-gray-500',
    };
    return map[color] || map.gray;
};

const getDotClasses = (color) => {
    const map = {
        error: 'bg-error',
        warning: 'bg-warning',
        success: 'bg-success',
        primary: 'bg-primary',
        gray: 'bg-gray-400',
    };
    return map[color] || map.gray;
};

// ─── Date helpers ──────────────────────────────────────────────────
const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getRelativeTime = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    if (minutes > 0) return `منذ ${minutes} دقيقة`;
    return 'الآن';
};


// ═══════════════════════════════════════════════════════════════════
const AdminDisputeDetailPage = () => {
    const { id } = useParams();
    const { data: dispute, isLoading, isError } = useDisputeDetail(id);

    const resolveMutation = useResolveDispute();

    const title = `تفاصيل النزاع #${id}`;
    const breadcrumbs = [
        { label: "الرئيسية", path: "/admin" },
        { label: "النزاعات", path: "/admin/disputes" },
        { label: `تفاصيل النزاع #${id}` },
    ];

    // ── Loading ────────────────────────────────────────────────
    if (isLoading) {
        return (
            <AdminLayout title={title} breadcrumbs={breadcrumbs}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="h-24 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                    <div className="h-16 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                    <div className="flex gap-6">
                        <div className="flex-1 h-96 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                        <div className="w-80 h-96 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // ── Error ──────────────────────────────────────────────────
    if (isError || !dispute) {
        return (
            <AdminLayout title={title} breadcrumbs={breadcrumbs}>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center" dir="rtl">
                        <p className="text-error font-medium">حدث خطأ أثناء تحميل تفاصيل النزاع. يرجى المحاولة لاحقاً.</p>
                        <Link to="/admin/disputes" className="mt-4 inline-block text-primary hover:underline text-sm">
                            ← العودة للنزاعات
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const statusInfo = STATUS_MAP[dispute.status] || { label: dispute.status, color: 'gray' };

    return (
        <AdminLayout title={title} breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto space-y-6" dir="rtl">

                {/* ── Page header: Title + status + download ─────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-primary">نزاع رقم #{dispute.id}</h2>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(statusInfo.color)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${getDotClasses(statusInfo.color)}`}></span>
                                {statusInfo.label}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            تم فتح النزاع {getRelativeTime(dispute.createdAt)} • آخر نشاط {getRelativeTime(dispute.lastActivityAt)}
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        سجل المحادثة
                    </button>
                </div>

                {/* ── Info bar: Client, Lawyer, Case, Date ────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        {/* Client */}
                        <div className="flex items-center gap-3">
                            <img
                                src={dispute.initiator.avatar}
                                alt={dispute.initiator.name}
                                className="w-10 h-10 rounded-full border-2 border-gray-100"
                            />
                            <div>
                                <p className="text-xs text-gray-400">{dispute.initiator.role}</p>
                                <p className="font-bold text-gray-900 text-sm">{dispute.initiator.name}</p>
                            </div>
                        </div>

                        {/* Respondent */}
                        <div className="flex items-center gap-3">
                            <img
                                src={dispute.respondent.avatar}
                                alt={dispute.respondent.name}
                                className="w-10 h-10 rounded-full border-2 border-gray-100"
                            />
                            <div>
                                <p className="text-xs text-gray-400">{dispute.respondent.role}</p>
                                <p className="font-bold text-gray-900 text-sm">{dispute.respondent.name}</p>
                            </div>
                        </div>

                        {/* Case ID */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400">رقم القضية</p>
                            <p className="font-bold text-gray-900 text-sm">#{dispute.caseId}</p>
                        </div>

                        {/* Date */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400">تاريخ البدء</p>
                            <p className="font-bold text-gray-900 text-sm">{formatDate(dispute.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* ── Main content: Chat + Admin Actions ─────────── */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Chat log (main area) */}
                    <div className="flex-1 min-w-0">
                        <DisputeChatLog
                            messages={dispute.disputeChatMessages}
                            initiator={dispute.initiator}
                            respondent={dispute.respondent}
                        />
                    </div>

                    {/* Admin actions sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <DisputeAdminActions
                            dispute={dispute}
                            onResolve={(payload) => resolveMutation.mutateAsync({ disputeId: dispute.id, payload })}
                            isResolving={resolveMutation.isPending}
                        />
                    </div>
                </div>

                {/* ── Attachments section ────────────────────────── */}
                <DisputeAttachments attachments={dispute.attachments} />
            </div>
        </AdminLayout>
    );
};

export default AdminDisputeDetailPage;

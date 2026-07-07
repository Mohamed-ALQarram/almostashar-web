import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../features/admin-dashboard/components/AdminLayout';
import {
    useAdminWithdrawalDetails,
    useRejectWithdrawal,
    useApproveWithdrawal,
    useMarkWithdrawalPaid,
    RejectWithdrawalModal,
    ApproveWithdrawalModal,
    MarkPaidWithdrawalModal
} from '../features/admin-withdrawals-requests';
import Button from '../components/ui/Button';

// Utility for formatting dates
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Pending':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    قيد الانتظار
                </span>
            );
        case 'Approved':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    تمت الموافقة
                </span>
            );
        case 'Paid':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    تم التحويل
                </span>
            );
        case 'Rejected':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    مرفوض
                </span>
            );
        case 'Cancelled':
            return (
                <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 w-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ملغي
                </span>
            );
        default:
            return <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 w-full">{status}</span>;
    }
};
const MethodIcon = ({ method }) => {
    switch (method) {
        case 'VodafoneCash':
            return (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm"> فودافون كاش</span>
                </div>
            );

        case 'InstaPay':
            return (
                <div className="flex items-center gap-2">
                    {/* InstaPay icon - Transfer arrows representing money exchange */}
                    <svg className="w-4 h-4 text-[#6F2282]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm"> إنستاباي</span>
                </div>
            );

        default:
            return (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-sm">تحويل بنكي</span>
                </div>
            );
    }
}


const AdminWithdrawalDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: request, isLoading, isError } = useAdminWithdrawalDetails(id);
    const [notes, setNotes] = useState('');

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false);

    const rejectMutation = useRejectWithdrawal();
    const approveMutation = useApproveWithdrawal();
    const markPaidMutation = useMarkWithdrawalPaid();

    if (isLoading) {
        return (
            <AdminLayout title="تفاصيل طلب السحب" breadcrumbs={[{ label: 'الرئيسية', path: '/admin' }, { label: 'طلبات السحب', path: '/admin/withdrawals' }, { label: 'تفاصيل الطلب', path: '#' }]}>
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </AdminLayout>
        );
    }

    if (isError || !request) {
        return (
            <AdminLayout title="تفاصيل طلب السحب" breadcrumbs={[{ label: 'الرئيسية', path: '/admin' }, { label: 'طلبات السحب', path: '/admin/withdrawals' }, { label: 'تفاصيل الطلب', path: '#' }]}>
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center font-medium">
                    حدث خطأ أثناء جلب تفاصيل الطلب أو أن الطلب غير موجود.
                </div>
            </AdminLayout>
        );
    }

    const isApproved = request.status === 'Approved' || request.status === 'Paid';
    const isRejected = request.status === 'Rejected';
    const isPaid = request.status === 'Paid';
    const isCancelled = request.status === 'Cancelled';

    // Status numeric level
    const statusLevel = isPaid ? 3 : isApproved ? 2 : 1;
    // We'll consider statusLevel=2 as "Under Review" but since we don't have a distinct "UnderReview" status in the enum from backend,
    // we assume Pending = level 1, Approved = level 2, Paid = level 3. 

    return (
        <AdminLayout title="تفاصيل طلب السحب" breadcrumbs={[{ label: 'الرئيسية', path: '/admin' }, { label: 'طلبات السحب', path: '/admin/withdrawals' }, { label: 'تفاصيل الطلب', path: '#' }]}>

            {/* Header / Breadcrumb navigation */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <button onClick={() => navigate('/admin/withdrawals')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="flex items-center gap-2 text-sm">
                    <Link to="/admin/withdrawals" className="text-gray-500 hover:text-primary transition-colors">طلبات السحب</Link>
                    <span className="text-gray-300">←</span>
                    <span className="font-bold text-gray-900">تفاصيل طلب السحب</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Right Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Request Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h2 className="font-bold text-gray-900 text-lg">معلومات الطلب</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">رقم الطلب</div>
                                <div className="font-medium text-gray-900" dir="ltr">WD-{new Date().getFullYear()}-{String(request.id).padStart(5, '0')}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">اسم المحامي</div>
                                <div className="font-medium text-gray-900">{request.lawyerName}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">البريد الإلكتروني</div>
                                <div className="font-medium text-gray-900">{request.lawyerEmail}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">المبلغ المطلوب</div>
                                <div className="font-bold text-gray-900 text-lg">
                                    {request.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">ج.م</span>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-sm text-gray-500 mb-1">طريقة السحب</div>
                                <div className="font-medium text-gray-900">
                                    {MethodIcon(request.method)}
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h2 className="font-bold text-gray-900 text-lg"> تفاصيل التحويل </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            {/* Assuming accountDetailsFull could be a string like "01003178639" for e-wallets or JSON for banks. We'll render whatever we have nicely */}
                            <div className="sm:col-span-2">
                                <div className="text-sm text-gray-500 mb-1">{request.method === 'VodafoneCash' ? 'رقم فودافون كاش' : request.method === 'InstaPay' ? ' رقم إنستاباي' : 'تفاصيل الحساب البنكي'}</div>
                                <div className="font-medium text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2" dir="ltr">
                                    {request.accountDetailsFull || request.accountDetailsMasked || '-'}
                                </div>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <div className="text-sm text-gray-500">تاريخ ووقت الطلب</div>
                                <div className="font-medium text-gray-900">
                                    {formatDate(request.requestedAt)} - {formatTime(request.requestedAt)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-sm text-gray-500">تاريخ المراجعة</div>
                                <div className="font-medium text-gray-900">
                                    {request.reviewedAt ? `${formatDate(request.reviewedAt)} - ${formatTime(request.reviewedAt)}` : <span className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500">لم تتم المراجعة بعد</span>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="text-sm text-gray-500">الحالة الحالية</div>
                                <div className="w-32">
                                    <StatusBadge status={request.status} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    {request.status === 'Pending' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 w-full sm:w-auto">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                يرجى مراجعة كافة البيانات بعناية قبل اتخاذ القرار
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Button onClick={() => setIsRejectModalOpen(true)} variant="outline" className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                    <span className="flex items-center justify-center gap-2">
                                        رفض
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </span>
                                </Button>
                                <Button onClick={() => setIsApproveModalOpen(true)} className="flex-1 sm:flex-none bg-primary text-white hover:bg-primary-dark border border-primary">
                                    <span className="flex items-center justify-center gap-2 px-6">
                                        موافقة
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {request.status === 'Approved' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 w-full sm:w-auto">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                يرجى تحويل المبلغ وتأكيد الدفع لإكمال الطلب
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Button onClick={() => setIsMarkPaidModalOpen(true)} className="flex-1 sm:flex-none bg-primary text-white hover:bg-primary-dark border border-primary w-full sm:w-auto">
                                    <span className="flex items-center justify-center gap-2 px-6">
                                        تأكيد الدفع
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Left Column (Sidebar Info) */}
                <div className="space-y-6">
                    {/* Status Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                        <span className="text-gray-500 font-medium">حالة الطلب:</span>
                        <div className="w-32">
                            <StatusBadge status={request.status} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-8">
                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h2 className="font-bold text-gray-900 text-lg">مخطط سير الطلب</h2>
                        </div>

                        <div className="relative border-r-2 border-gray-100 pr-6 space-y-8">

                            {/* Step 1: Submitted */}
                            <div className="relative">
                                <div className={`absolute -right-[31px] w-4 h-4 rounded-full border-2  ${statusLevel >= 1 ? 'border-gold bg-gold' : 'border-gray-300 bg-white'}`}></div>
                                <h3 className={`font-bold ${statusLevel >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>تم تقديم الطلب</h3>
                                <div className="text-sm text-gray-500 mt-1">{formatDate(request.requestedAt)} - {formatTime(request.requestedAt)}</div>
                                <div className="text-xs text-gray-400 mt-1">قيد المراجعة من قبل الإدارة</div>
                            </div>
                            {/*  Cancelled or rejected */}
                            {isRejected ? (
                                /* Render this block if the request is rejected */
                                <div className="relative">
                                    <div className="absolute -right-[31px] w-4 h-4 rounded-full border-2 bg-gold border-gold"></div>
                                    <h3 className="font-bold text-gray-900">تم رفض الطلب</h3>
                                    <div className="text-sm text-gray-500 mt-1">{formatDate(request?.reviewedAt)} - {formatTime(request?.reviewedAt)}</div>

                                </div>
                            ) : isCancelled ? (
                                /* Render this block if the request is cancelled */
                                <div className="relative">
                                    <div className="absolute -right-[31px] w-4 h-4 rounded-full border-2 bg-gold border-gold-300"></div>
                                    <h3 className="font-bold text-gray-900 ">تم الغاء الطلب</h3>
                                    <div className="text-sm text-gray-500 mt-1">{formatDate(request?.reviewedAt)} - {formatTime(request?.reviewedAt)}</div>

                                </div>
                            ) :
                                (<>
                                    {/* Step 2: Approved */}
                                    <div className="relative">
                                        <div className={`absolute -right-[31px] w-4 h-4 rounded-full border-2  ${statusLevel >= 2 ? 'border-gold bg-gold' : 'border-gray-300 bg-white'}`}></div>
                                        <h3 className={`font-bold ${statusLevel >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>تمت الموافقة</h3>
                                        {statusLevel >= 2 && request.reviewedAt ? (
                                            <div className="text-sm text-gray-500 mt-1">{formatDate(request.reviewedAt)} - {formatTime(request.reviewedAt)}</div>
                                        ) : (
                                            <div className="text-xs text-gray-400 mt-1">لم تتم الموافقة بعد</div>
                                        )}
                                    </div>
                                    {/* Step 3: Transferred */}
                                    < div className="relative" >
                                        <div className={`absolute -right-[31px] w-4 h-4 rounded-full border-2  ${statusLevel >= 3 ? 'border-gold bg-gold' : 'border-gray-300 bg-white'}`}></div>
                                        <h3 className={`font-bold ${statusLevel >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>تم التحويل</h3>
                                        {statusLevel >= 3 && request.paidAt ? (
                                            <div className="text-sm text-gray-500 mt-1">{formatDate(request.paidAt)} - {formatTime(request.paidAt)}</div>
                                        ) : (
                                            <div className="text-xs text-gray-400 mt-1">لم يتم التحويل بعد</div>
                                        )}
                                    </div>
                                </>)}
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <h2 className="font-bold text-gray-900 text-lg">ملاحظات الإدارة</h2>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="أضف ملاحظة داخلية..."
                            className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            هذه الملاحظات داخلية ولا تظهر للمحامي
                        </p>
                    </div>
                </div>

                <RejectWithdrawalModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    isPending={rejectMutation.isPending}
                    onConfirm={(data) => {
                        rejectMutation.mutate({ id, data }, {
                            onSuccess: () => setIsRejectModalOpen(false)
                        });
                    }}
                />

                <ApproveWithdrawalModal
                    isOpen={isApproveModalOpen}
                    onClose={() => setIsApproveModalOpen(false)}
                    isPending={approveMutation.isPending}
                    onConfirm={(data) => {
                        approveMutation.mutate({ id, data }, {
                            onSuccess: () => setIsApproveModalOpen(false)
                        });
                    }}
                />

                <MarkPaidWithdrawalModal
                    isOpen={isMarkPaidModalOpen}
                    onClose={() => setIsMarkPaidModalOpen(false)}
                    isPending={markPaidMutation.isPending}
                    onConfirm={(data) => {
                        markPaidMutation.mutate({ id, data }, {
                            onSuccess: () => setIsMarkPaidModalOpen(false)
                        });
                    }}
                />
            </div>
        </AdminLayout >
    );
};

export default AdminWithdrawalDetailsPage;

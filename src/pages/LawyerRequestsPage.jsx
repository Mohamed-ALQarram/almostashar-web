import React, { useState } from 'react';
import {
    LawyerLayout,
    useIncomingRequestsList,
    useAcceptRequest,
    useRejectRequest,
    LawyerRequestCard,
    LawyerRequestDetails
} from '../features/lawyer-dashboard';

import { useLocation } from 'react-router-dom';

const LawyerRequestsPage = () => {
    const location = useLocation();

    // We can add filters to this state if needed later
    const [queryParams, setQueryParams] = useState({});
    const { data: requests = [], isLoading, isError } = useIncomingRequestsList(queryParams);

    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectRequest();

    const isProcessing = isAccepting || isRejecting;

    const [selectedRequest, setSelectedRequest] = useState(location.state?.selectedRequest || null);

    const handleAccept = (id) => {
        acceptRequest(id, {
            onSuccess: () => {
                if (selectedRequest?.id === id) {
                    setSelectedRequest(null); // Go back to list on success
                }
            }
        });
    };

    const handleReject = (id) => {
        rejectRequest(id, {
            onSuccess: () => {
                if (selectedRequest?.id === id) {
                    setSelectedRequest(null); // Go back to list on success
                }
            }
        });
    };

    return (
        <LawyerLayout>
            <div className="max-w-7xl mx-auto pb-10" dir="rtl">

                {selectedRequest ? (
                    <LawyerRequestDetails
                        request={selectedRequest}
                        onBack={() => setSelectedRequest(null)}
                        isLoadingActions={isProcessing}
                        actions={
                            <>
                                <button
                                    onClick={() => handleAccept(selectedRequest.id)}
                                    disabled={isProcessing}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    قبول الطلب
                                </button>
                                <button
                                    onClick={() => handleReject(selectedRequest.id)}
                                    disabled={isProcessing}
                                    className="w-full bg-white text-red-600 border border-red-600 hover:bg-red-50 py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    رفض
                                </button>
                            </>
                        }
                    />
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">طلبات مباشرة</h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    استعرض طلبات العملاء المباشرة الواردة إليك واتخذ الإجراء المناسب.
                                </p>
                            </div>

                            <button
                                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span>تصفية</span>
                            </button>
                        </div>

                        {/* Loading / Error States */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-20">
                                <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center py-20 text-red-500">
                                حدث خطأ أثناء تحميل الطلبات المباشرة.
                            </div>
                        )}

                        {/* List Grid */}
                        {!isLoading && !isError && (
                            <>
                                {requests.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700">لا توجد طلبات واردة</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            لم تتلق أي طلبات مباشرة بعد.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {requests.map(request => (
                                            <LawyerRequestCard
                                                key={request.id}
                                                request={request}
                                                actions={
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <button
                                                            onClick={() => setSelectedRequest(request)}
                                                            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            عرض التفاصيل
                                                        </button>
                                                        <div className="flex gap-2 w-full">
                                                            <button
                                                                onClick={() => handleAccept(request.id)}
                                                                disabled={isProcessing}
                                                                className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                قبول الطلب
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request.id)}
                                                                disabled={isProcessing}
                                                                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                رفض
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </LawyerLayout>
    );
};

export default LawyerRequestsPage;

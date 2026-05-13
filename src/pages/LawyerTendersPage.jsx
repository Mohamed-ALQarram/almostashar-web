import React, { useState } from 'react';
import {
    LawyerLayout,
    useAvailableBroadcastRequests,
    useSendOffer,
    LawyerRequestCard,
    LawyerRequestDetails,
    SendOfferModal,
    OfferResultCard
} from '../features/lawyer-dashboard';

const LawyerTendersPage = () => {
    const [queryParams, setQueryParams] = useState({});
    const { data: responseData, isLoading, isError } = useAvailableBroadcastRequests(queryParams);
    const requests = responseData?.items || [];

    const { mutate: sendOffer, isPending: isSubmittingOffer } = useSendOffer();

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [offerModalRequest, setOfferModalRequest] = useState(null);

    const [offerResultData, setOfferResultData] = useState(null);
    const [offerResultError, setOfferResultError] = useState(null);

    const handleSendOffer = (offerData) => {
        if (!offerModalRequest) return;

        sendOffer({ id: offerModalRequest.id, data: offerData }, {
            onSuccess: (data) => {
                setOfferModalRequest(null);
                setOfferResultData(data);
                setOfferResultError(null);
                if (selectedRequest?.id === offerModalRequest.id) {
                    setSelectedRequest(null); // Go back to list after success if we were in details view
                }
            },
            onError: (error) => {
                setOfferModalRequest(null);
                setOfferResultData(null);
                setOfferResultError(error);
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
                        actions={
                            <button
                                onClick={() => setOfferModalRequest(selectedRequest)}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <span>إرسال عرض</span>
                            </button>
                        }
                    />
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">فرص المناقصات</h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    استعرض طلبات العملاء المتاحة للمناقصة وقدم عروضك للحصول عليها.
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
                                حدث خطأ أثناء تحميل فرص المناقصات المتاحة.
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
                                        <h3 className="text-lg font-medium text-gray-700">لا توجد مناقصات متاحة</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            لم يتم طرح أي طلبات جديدة للمناقصة مؤخراً.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {requests.map(request => (
                                            <LawyerRequestCard
                                                key={request.id}
                                                request={request}
                                                actions={
                                                    <>
                                                        <button
                                                            onClick={() => setSelectedRequest(request)}
                                                            className="flex-[0.8] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            عرض التفاصيل
                                                        </button>

                                                        <button
                                                            onClick={() => setOfferModalRequest(request)}
                                                            className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            إرسال عرض
                                                        </button>
                                                    </>
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                <SendOfferModal
                    isOpen={!!offerModalRequest}
                    onClose={() => setOfferModalRequest(null)}
                    request={offerModalRequest}
                    onSubmit={handleSendOffer}
                    isSubmitting={isSubmittingOffer}
                />

                {(offerResultData || offerResultError) && (
                    <OfferResultCard
                        offer={offerResultData}
                        error={offerResultError}
                        onClose={() => {
                            setOfferResultData(null);
                            setOfferResultError(null);
                        }}
                    />
                )}
            </div>
        </LawyerLayout>
    );
};

export default LawyerTendersPage;

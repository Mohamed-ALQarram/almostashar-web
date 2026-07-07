import useAdminWithdrawalsList from '../hooks/useAdminWithdrawalsList';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const WithdrawalRequests = ({ statusFilter = "All", pageSize = 5, cursor = null }) => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useAdminWithdrawalsList({ status: statusFilter, cursor, pageSize, });
    const requests = data?.items;

    if (isLoading) {
        return <div className="h-64 bg-white rounded-2xl shadow-sm animate-pulse mb-8"></div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50/50 overflow-hidden mb-8" dir="rtl">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h2 className="font-bold text-gray-900">طلبات سحب الأرباح</h2>
                </div>
                <button className="text-sm text-primary font-medium hover:text-primary-light transition-colors"
                    onClick={() => navigate('/admin/withdrawals')}
                >
                    عرض الكل

                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-400 bg-gray-50/50 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium">المستشار</th>
                            <th scope="col" className="px-6 py-4 font-medium">المبلغ</th>
                            <th scope="col" className="px-6 py-4 font-medium">التاريخ</th>
                            <th scope="col" className="px-6 py-4 font-medium text-center">الإجراء</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests?.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-gray-900">{request.lawyerName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-semibold text-gray-900 flex items-center gap-1">
                                        {request.amount.toLocaleString()} <span className="text-xs text-gray-500 font-normal">{request.currency}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {request.requestedAt}
                                </td>
                                <td className="py-4 px-6 text-center whitespace-nowrap">
                                    <Button
                                        variant="outline"
                                        className="!px-3 !py-1.5 !text-xs whitespace-nowrap gap-1"
                                        onClick={() => navigate(`/admin/withdrawals/${request.id}`)}
                                    >
                                        عرض التفاصيل
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {requests?.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">لا توجد طلبات سحب الحالية</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WithdrawalRequests;

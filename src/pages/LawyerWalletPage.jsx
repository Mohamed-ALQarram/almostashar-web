import React, { useState } from 'react';
import {
    LawyerLayout,
} from '../features/lawyer-dashboard';
import {
    useWallet,
    useWalletTransactions,
    useWithdrawalRequests,
    useCreateWithdrawal,
    useCancelWithdrawal,
} from '../features/lawyer-dashboard/hooks/useLawyerWallet';
import WalletBalanceCard from '../features/lawyer-dashboard/components/Wallet/WalletBalanceCard';
import WithdrawButton from '../features/lawyer-dashboard/components/Wallet/WithdrawButton';
import WalletTabs from '../features/lawyer-dashboard/components/Wallet/WalletTabs';
import TransactionsList from '../features/lawyer-dashboard/components/Wallet/TransactionsList';
import WithdrawalsList from '../features/lawyer-dashboard/components/Wallet/WithdrawalsList';
import WithdrawModal from '../features/lawyer-dashboard/components/Wallet/WithdrawModal';

const LawyerWalletPage = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // ─── Data hooks ─────────────────────────────────────────────────
    const { data: wallet, isLoading: walletLoading } = useWallet();

    const {
        data: transactionsData,
        isLoading: txLoading,
        isError: txError,
        hasNextPage: txHasNext,
        fetchNextPage: txFetchNext,
        isFetchingNextPage: txFetchingNext,
    } = useWalletTransactions();

    const {
        data: withdrawalsData,
        isLoading: wdLoading,
        isError: wdError,
        hasNextPage: wdHasNext,
        fetchNextPage: wdFetchNext,
        isFetchingNextPage: wdFetchingNext,
    } = useWithdrawalRequests();

    const { mutate: createWithdrawal, isPending: isCreating } = useCreateWithdrawal();
    const { mutate: cancelWithdrawal, isPending: isCancelling } = useCancelWithdrawal();

    // ─── Handlers ───────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleCreateWithdrawal = (data) => {
        createWithdrawal(data, {
            onSuccess: () => {
                setIsWithdrawModalOpen(false);
                showToast('success', 'تم إرسال طلب السحب بنجاح');
                setActiveTab('withdrawals');
            },
            onError: (err) => {
                showToast('error', err?.message || 'حدث خطأ أثناء إرسال الطلب');
            },
        });
    };

    const handleCancelWithdrawal = (id) => {
        cancelWithdrawal(id, {
            onSuccess: () => {
                showToast('success', 'تم إلغاء طلب السحب بنجاح');
            },
            onError: (err) => {
                showToast('error', err?.message || 'حدث خطأ أثناء إلغاء الطلب');
            },
        });
    };

    return (
        <LawyerLayout>
            <div className="max-w-4xl mx-auto pb-10" dir="rtl">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">المحفظة</h1>
                    <p className="text-sm text-gray-500 mt-1">إدارة رصيدك ومتابعة المعاملات وطلبات السحب</p>
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-medium text-center animate-fadeIn flex items-center justify-center gap-2 ${toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {toast.type === 'success'
                            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        }
                        {toast.message}
                    </div>
                )}

                {/* Balance Card */}
                <WalletBalanceCard wallet={wallet} isLoading={walletLoading} />

                {/* Withdraw Button */}
                <div className="mt-5">
                    <WithdrawButton
                        onClick={() => setIsWithdrawModalOpen(true)}
                        disabled={!wallet || wallet.availableBalance <= 0}
                    />
                </div>

                {/* Tabs + Content */}
                <div className="mt-8">
                    <WalletTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    {activeTab === 'transactions' && (
                        <TransactionsList
                            data={transactionsData}
                            isLoading={txLoading}
                            isError={txError}
                            hasNextPage={txHasNext}
                            fetchNextPage={txFetchNext}
                            isFetchingNextPage={txFetchingNext}
                        />
                    )}

                    {activeTab === 'withdrawals' && (
                        <WithdrawalsList
                            data={withdrawalsData}
                            isLoading={wdLoading}
                            isError={wdError}
                            hasNextPage={wdHasNext}
                            fetchNextPage={wdFetchNext}
                            isFetchingNextPage={wdFetchingNext}
                            onCancel={handleCancelWithdrawal}
                            isCancelling={isCancelling}
                        />
                    )}
                </div>

                {/* Withdraw Modal */}
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    onSubmit={handleCreateWithdrawal}
                    isSubmitting={isCreating}
                    availableBalance={wallet?.availableBalance}
                />
            </div>
        </LawyerLayout>
    );
};

export default LawyerWalletPage;

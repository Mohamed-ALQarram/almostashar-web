import React from 'react';
import { TrendingUp, Lock, Clock, Wallet } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount ?? 0);
};

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-2 text-center flex-col">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
        <p className="text-sm font-bold text-gray-800">{formatCurrency(value)} ج.م</p>
    </div>
);

const WalletBalanceCard = ({ wallet, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-gradient-to-bl from-[#F5F0E1] via-white to-[#F0EDE4] rounded-2xl p-6 lg:p-8 border border-gold/10 shadow-sm animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4" />
                <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-6" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-bl from-[#F5F0E1] via-white to-[#F0EDE4] rounded-2xl p-6 lg:p-8 border border-gold/10 shadow-sm">
            {/* Hero balance */}
            <div className="flex flex-col items-center mb-6">
                {/* Scale icon */}
                <div className="w-16 h-16 mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18" />
                        <path d="M5 6l7-3 7 3" />
                        <path d="M2 12l3-6 3 6a5.5 5.5 0 0 1-6 0Z" />
                        <path d="M16 12l3-6 3 6a5.5 5.5 0 0 1-6 0Z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-500 font-medium">الرصيد المتاح</p>
                <p className="text-3xl lg:text-4xl font-bold text-primary mt-1 tracking-tight">
                    <span className="text-lg text-gray-400 ml-1">ج.م</span>
                    {formatCurrency(wallet?.availableBalance)}
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-200/60">
                <StatItem
                    icon={Clock}
                    label="السحب المعلق"
                    value={wallet?.pendingWithdrawalBalance}
                    color="bg-amber-50 text-amber-600"
                />
                <StatItem
                    icon={Lock}
                    label="الرصيد المحجوز"
                    value={wallet?.escrowBalance}
                    color="bg-blue-50 text-blue-600"
                />
                <StatItem
                    icon={TrendingUp}
                    label="إجمالي الأرباح"
                    value={wallet?.totalEarnings}
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Total withdrawn */}
            <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-200/60">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">إجمالي المسحوب</span>
                <span className="text-sm font-bold text-gray-800 mr-auto">{formatCurrency(wallet?.totalWithdrawn)} ج.م</span>
            </div>
        </div>
    );
};

export default WalletBalanceCard;

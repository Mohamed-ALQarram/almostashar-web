import React from 'react';

const TABS = [
    { key: 'withdrawals', label: 'طلبات السحب' },
    { key: 'transactions', label: 'المعاملات' },
];

const WalletTabs = ({ activeTab, onTabChange }) => (
    <div className="flex items-center border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
            <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`relative px-6 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === tab.key
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                {tab.label}
                {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
            </button>
        ))}
    </div>
);

export default WalletTabs;

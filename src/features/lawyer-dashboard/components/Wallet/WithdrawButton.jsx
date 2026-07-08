import React from 'react';
import { Download } from 'lucide-react';

const WithdrawButton = ({ onClick, disabled }) => (
    <div className="space-y-2">
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="w-5 h-5" />
            <span>طلب سحب</span>
        </button>
        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            يمكنك طلب سحب أرباحك إلى حسابك البنكي المعتمد. تتم معالجة الطلبات خلال ١-٢ يوم عمل
        </p>
    </div>
);

export default WithdrawButton;

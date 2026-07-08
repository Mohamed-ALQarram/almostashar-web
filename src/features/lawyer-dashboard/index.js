// Components
export { default as LawyerSidebar } from './components/Common/LawyerSidebar';
export { default as LawyerHeader } from './components/Common/LawyerHeader';
export { default as LawyerLayout } from './components/Common/LawyerLayout';
export { default as StatsCards } from './components/Home/StatsCards';
export { default as RequestCard } from './components/Home/RequestCard';
export { default as IncomingRequests } from './components/Home/IncomingRequests';
export { default as ActiveCases } from './components/Home/ActiveCases';
export { default as LastMessages } from './components/Home/LastMessages';
export { default as ChatCard } from './components/Chat/ChatCard';
export { default as ChatList } from './components/Chat/ChatList';
export { default as ChatArea } from './components/Chat/ChatArea';

// Cases Components
export { default as CaseCard } from './components/Cases/CaseCard';
export { default as CaseDetails } from './components/Cases/CaseDetails';

// Requests Components
export { default as LawyerRequestCard } from './components/requests/LawyerRequestCard';
export { default as LawyerRequestDetails } from './components/requests/LawyerRequestDetails';
export { default as OfferResultCard } from './components/requests/OfferResultCard';
export { default as SendOfferModal } from './components/requests/SendOfferModal';

// Services Components
export { default as AddLawyerServiceModal } from './components/services/AddLawyerServiceModal';
export { default as EditLawyerServiceModal } from './components/services/EditLawyerServiceModal';
export { default as LawyerServiceCard } from './components/services/LawyerServiceCard';

// Hooks
export {
    useLawyerAnalytics,
    useIncomingRequests,
    useActiveCases,
    useNotifications,
    useMarkNotificationsAsRead,
    useChats,
    useChatMessages,
} from './hooks/useLawyerDashboard';

export {
    useIncomingRequestsList,
    useAcceptRequest,
    useRejectRequest,
    useAvailableBroadcastRequests,
    useSendOffer
} from './hooks/useLawyerRequests';

export {
    useLawyerServices,
    useAddLawyerService,
    useUpdateLawyerService
} from './hooks/useLawyerServices';

export { default as useChatSignalR } from './hooks/useChatSignalR';
export { default as useSendMessage } from './hooks/useSendMessage';
export { default as useTypingIndicator } from './hooks/useTypingIndicator';

export { useLawyerCases, useCaseDetails } from './hooks/useLawyerCases';

export {
    useLawyerProfile,
    useSpecializations,
    useEditProfile
} from './hooks/useLawyerProfile';

// Wallet Hooks
export {
    useWallet,
    useWalletTransactions,
    useWithdrawalRequests,
    useCreateWithdrawal,
    useCancelWithdrawal,
} from './hooks/useLawyerWallet';

// Wallet Components
export { default as WalletBalanceCard } from './components/Wallet/WalletBalanceCard';
export { default as WithdrawButton } from './components/Wallet/WithdrawButton';
export { default as WalletTabs } from './components/Wallet/WalletTabs';
export { default as TransactionsList } from './components/Wallet/TransactionsList';
export { default as WithdrawalsList } from './components/Wallet/WithdrawalsList';
export { default as WithdrawModal } from './components/Wallet/WithdrawModal';

// Store
export { useLawyerSidebarStore } from './store/lawyerSidebarStore';

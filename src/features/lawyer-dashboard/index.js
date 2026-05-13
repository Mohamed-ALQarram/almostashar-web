// Components
export { default as LawyerSidebar } from './components/LawyerSidebar';
export { default as LawyerHeader } from './components/LawyerHeader';
export { default as LawyerLayout } from './components/LawyerLayout';
export { default as StatsCards } from './components/StatsCards';
export { default as RequestCard } from './components/RequestCard';
export { default as IncomingRequests } from './components/IncomingRequests';
export { default as ActiveCases } from './components/ActiveCases';
export { default as LastMessages } from './components/LastMessages';
export { default as ChatCard } from './components/ChatCard';
export { default as ChatList } from './components/ChatList';
export { default as ChatArea } from './components/ChatArea';

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

// Store
export { useLawyerSidebarStore } from './store/lawyerSidebarStore';

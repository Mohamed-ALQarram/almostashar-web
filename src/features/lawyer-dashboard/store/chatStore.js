import { create } from 'zustand';

/**
 * Ephemeral UI state for chat — typing indicators + active chat tracking.
 *
 * typingUsers: { [chatId]: senderId | null }
 * activeChatId: the currently open chatId (so SignalR can auto mark-as-read)
 */
export const useChatStore = create((set) => ({
    typingUsers: {},
    activeChatId: null,

    setActiveChatId: (chatId) => set({ activeChatId: chatId }),

    setTyping: (chatId, senderId) =>
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [chatId]: senderId,
            },
        })),

    clearTyping: (chatId) =>
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [chatId]: null,
            },
        })),
}));

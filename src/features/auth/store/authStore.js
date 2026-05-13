import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stopChatHub } from '../../lawyer-dashboard/signalr/chatHub';

export const useAuthStore = create(
    persist(
        (set) => ({
            // ── State ──────────────────────────────────────
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            // ── Actions ────────────────────────────────────
            setAuth: (value) =>
                set({
                    user: value.user,
                    accessToken: value.tokens.accessToken,
                    refreshToken: value.tokens.refreshToken,
                    isAuthenticated: true,
                }),

            updateUser: (updatedFields) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedFields } : null,
                })),

            logout: () => {
                stopChatHub();
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'almostashar-auth', // localStorage key
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLawyerSidebarStore = create(
    persist(
        (set) => ({
            // ── State ──────────────────────────────────────
            isOpen: false,        // mobile drawer
            isCollapsed: false,   // desktop: icons only (no text)

            // ── Actions ────────────────────────────────────
            setOpen: (value) => set({ isOpen: value }),
            close: () => set({ isOpen: false }),
            toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
            setCollapsed: (value) => set({ isCollapsed: value }),
        }),
        {
            name: 'almostashar-lawyer-sidebar',
            partialize: (state) => ({
                isCollapsed: state.isCollapsed,
            }),
        }
    )
);

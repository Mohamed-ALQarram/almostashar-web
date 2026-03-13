import { create } from 'zustand';

export const useLawyerRegisterStore = create((set) => ({
    // ── State ──────────────────────────────────────
    formData: null,

    // ── Actions ────────────────────────────────────
    setFormData: (data) => set({ formData: data }),
    reset: () => set({ formData: null }),
}));

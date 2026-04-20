import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
    // UI State
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // UI Defaults
            theme: 'light',
            sidebarOpen: true,
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),

        }),
        {
            name: 'powergrid-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);

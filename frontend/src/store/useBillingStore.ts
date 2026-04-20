import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BillingSummary {
    billId: string;
    amount: number;
    status: string;
    dueDate: string;
}

interface BillingState {
    lastPaymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | null;
    currentBillSummary: BillingSummary | null;
    selectedLocationId: string | null;
    
    // Actions
    setLastPaymentStatus: (status: 'SUCCESS' | 'FAILED' | 'PENDING' | null) => void;
    setBillSummary: (summary: BillingSummary | null) => void;
    setSelectedLocation: (locationId: string) => void;
    clearBillingData: () => void;
}

export const useBillingStore = create<BillingState>()(
    persist(
        (set) => ({
            lastPaymentStatus: null,
            currentBillSummary: null,
            selectedLocationId: null,

            setLastPaymentStatus: (status) => set({ lastPaymentStatus: status }),
            setBillSummary: (summary) => set({ currentBillSummary: summary }),
            setSelectedLocation: (locationId) => set({ selectedLocationId: locationId }),
            clearBillingData: () => set({ lastPaymentStatus: null, currentBillSummary: null }),
        }),
        {
            name: 'powergrid-billing-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

import { create } from 'zustand';
import type { ActiveAppliance } from '../types/activeAppliance.types';

interface ActiveApplianceState {
  appliancesByLocation: Record<string, ActiveAppliance[]>;
  selectedApplianceIdByLocation: Record<string, string | null>;
  setAppliancesForLocation: (locationId: string, appliances: ActiveAppliance[]) => void;
  setSelectedAppliance: (locationId: string, applianceId: string) => void;
}

export const useActiveApplianceStore = create<ActiveApplianceState>((set) => ({
  appliancesByLocation: {},
  selectedApplianceIdByLocation: {},
  setAppliancesForLocation: (locationId, appliances) =>
    set((state) => {
      const currentAppliances = state.appliancesByLocation[locationId] || [];
      
      // Optimization: If the array length and items are the same (shallow check), skip update
      if (
        currentAppliances.length === appliances.length &&
        currentAppliances.every((app, i) => app.applianceId === appliances[i].applianceId)
      ) {
        return state;
      }

      const currentSelected = state.selectedApplianceIdByLocation[locationId];
      const hasCurrentSelected = appliances.some(
        (appliance) => appliance.applianceId === currentSelected
      );
      const fallbackSelection = appliances[0]?.applianceId ?? null;

      return {
        appliancesByLocation: {
          ...state.appliancesByLocation,
          [locationId]: appliances,
        },
        selectedApplianceIdByLocation: {
          ...state.selectedApplianceIdByLocation,
          [locationId]: hasCurrentSelected ? currentSelected ?? null : fallbackSelection,
        },
      };
    }),
  setSelectedAppliance: (locationId, applianceId) =>
    set((state) => ({
      selectedApplianceIdByLocation: {
        ...state.selectedApplianceIdByLocation,
        [locationId]: applianceId,
      },
    })),
}));

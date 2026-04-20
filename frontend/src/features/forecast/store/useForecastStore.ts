import { create } from 'zustand';
import type { ForecastData } from '../types/forecast.types';

interface ForecastState {
  selectedLocationId: string;
  forecastByLocation: Record<string, ForecastData>;
  setSelectedLocationId: (locationId: string) => void;
  setForecastForLocation: (locationId: string, forecast: ForecastData) => void;
}

export const DEFAULT_LOCATION_ID = 'DL-BDP-100234567';

export const useForecastStore = create<ForecastState>((set) => ({
  selectedLocationId: DEFAULT_LOCATION_ID,
  forecastByLocation: {},
  setSelectedLocationId: (locationId) => set({ selectedLocationId: locationId }),
  setForecastForLocation: (locationId, forecast) =>
    set((state) => ({
      forecastByLocation: {
        ...state.forecastByLocation,
        [locationId]: forecast,
      },
    })),
}));

import { apiClient } from '../../../lib/axios';
import type { ForecastData, ForecastResponse } from '../types/forecast.types';

export const forecastApi = {
  async getForecastByLocation(locationId: string): Promise<ForecastData> {
    const response = await apiClient.get<ForecastResponse>(`/forecast/${locationId}`);
    return response.data.data;
  },
};

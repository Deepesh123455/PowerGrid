import { apiClient } from '../../../lib/axios';
import type { LoadGraphData, LoadGraphResponse } from '../types/loadGraph.types';

export const loadGraphApi = {
  async getLoadGraphsByLocationAndInterval(locationId: string, intervalType: 'daily' | 'weekly' | 'monthly'): Promise<LoadGraphData[]> {
    const response = await apiClient.get<LoadGraphResponse>(`/load-graphs/${locationId}/${intervalType}`);
    return response.data.data;
  },
  async getAllLoadGraphsByLocation(locationId: string): Promise<LoadGraphData[]> {
    const response = await apiClient.get<LoadGraphResponse>(`/load-graphs/${locationId}`);
    return response.data.data;
  },
};

import { apiClient } from '../../../lib/axios';
import type { ApplianceSessionResponse } from '../types/applianceSession.types';

export const applianceSessionApi = {
  getApplianceSessions: async (locationId: string): Promise<ApplianceSessionResponse> => {
    console.log('API: getApplianceSessions called with locationId:', locationId);
    const response = await apiClient.get<ApplianceSessionResponse>(`/locations/${locationId}/appliance-sessions`);
    return response.data;
  },

  getApplianceSessionsByType: async (locationId: string, applianceType: string): Promise<ApplianceSessionResponse> => {
    console.log('API: getApplianceSessionsByType called with locationId:', locationId, 'applianceType:', applianceType);
    const response = await apiClient.get<ApplianceSessionResponse>(`/locations/${locationId}/appliance-sessions/${applianceType}`);
    return response.data;
  },
};

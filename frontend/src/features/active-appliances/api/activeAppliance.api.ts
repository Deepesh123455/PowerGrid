import { apiClient } from '../../../lib/axios';
import type {
  ActiveAppliance,
  ActiveAppliancesResponse,
} from '../types/activeAppliance.types';

export const activeApplianceApi = {
  async getActiveAppliances(locationId?: string): Promise<ActiveAppliance[]> {
    const response = await apiClient.get<ActiveAppliancesResponse>('/active-appliances', {
      params: locationId ? { locationId } : undefined,
    });

    return response.data.data;
  },
};

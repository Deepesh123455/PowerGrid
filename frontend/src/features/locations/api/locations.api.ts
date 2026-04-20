import { apiClient as api } from '../../../lib/axios';
import type { GetLocationsResponse } from '../types/locations.types';

export const locationsApi = {
  getLocationsByUserId: async (userId: string): Promise<GetLocationsResponse> => {
    const { data } = await api.get(`/locations?userId=${userId}`);
    return data;
  },
  
  deleteLocation: async (locationId: string): Promise<{status: string, message: string}> => {
    const { data } = await api.delete(`/locations/${locationId}`);
    return data;
  }
};

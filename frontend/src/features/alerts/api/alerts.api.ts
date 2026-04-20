import { apiClient as api } from '../../../lib/axios';
import type {
  GetAlertsResponse,
  GetUnreadCountResponse,
  MarkAsReadResponse
} from '../types/alerts.types';

export const alertsApi = {
  getAlertsByLocationId: async (locationId: string): Promise<GetAlertsResponse> => {
    const { data } = await api.get(`/alerts/${locationId}`);
    return data;
  },

  getUnreadCount: async (locationId: string): Promise<GetUnreadCountResponse> => {
    const { data } = await api.get(`/alerts/${locationId}/unread-count`);
    return data;
  },

  markAsRead: async (alertId: string): Promise<MarkAsReadResponse> => {
    const { data } = await api.patch(`/alerts/${alertId}/read`);
    return data;
  }
};

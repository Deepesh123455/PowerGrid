import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api/alerts.api';

export const alertsKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertsKeys.all, 'list'] as const,
  list: (locationId: string) => [...alertsKeys.lists(), locationId] as const,
  counts: () => [...alertsKeys.all, 'count'] as const,
  count: (locationId: string) => [...alertsKeys.counts(), locationId] as const,
};

export const useAlerts = (locationId: string) => {
  return useQuery({
    queryKey: alertsKeys.list(locationId),
    queryFn: () => alertsApi.getAlertsByLocationId(locationId),
    enabled: !!locationId,
  });
};

export const useUnreadAlertsCount = (locationId: string) => {
  return useQuery({
    queryKey: alertsKeys.count(locationId),
    queryFn: () => alertsApi.getUnreadCount(locationId),
    enabled: !!locationId,
    refetchInterval: 30000, // Poll every 30s to keep badge dynamic natively
  });
};

export const useMarkAlertAsRead = (locationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => alertsApi.markAsRead(alertId),
    onSuccess: () => {
      // Refresh both the lists and counts immediately after patch success
      queryClient.invalidateQueries({ queryKey: alertsKeys.list(locationId) });
      queryClient.invalidateQueries({ queryKey: alertsKeys.count(locationId) });
    },
  });
};

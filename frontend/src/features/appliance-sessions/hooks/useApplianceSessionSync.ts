import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applianceSessionApi } from '../api/applianceSession.api';

export function useApplianceSessionSync(locationId: string, applianceType?: string) {
  const query = useQuery({
    queryKey: ['applianceSession', locationId, applianceType],
    queryFn: () => applianceType 
      ? applianceSessionApi.getApplianceSessionsByType(locationId, applianceType)
      : applianceSessionApi.getApplianceSessions(locationId),
    enabled: Boolean(locationId),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return useMemo(() => ({
    ...query,
    sessions: query.data?.data ?? [],
  }), [query]);
}

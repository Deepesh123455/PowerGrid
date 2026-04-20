import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadGraphApi } from '../api/loadGraph.api';

export function useLoadGraphSync(locationId: string, intervalType: 'daily' | 'weekly' | 'monthly') {
  const query = useQuery({
    queryKey: ['loadGraph', locationId, intervalType],
    queryFn: () => loadGraphApi.getLoadGraphsByLocationAndInterval(locationId, intervalType),
    enabled: Boolean(locationId) && Boolean(intervalType),
    staleTime: 0, // Always consider data stale to force refetch
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  return useMemo(() => ({
    ...query,
    loadGraphs: query.data ?? [],
  }), [query]);
}

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { activeApplianceApi } from '../api/activeAppliance.api';
import { useActiveApplianceStore } from '../store/useActiveApplianceStore';

const EMPTY_ARRAY: any[] = [];

export function useActiveAppliancesSync(locationId: string) {
  const setAppliancesForLocation = useActiveApplianceStore((state) => state.setAppliancesForLocation);
  const setSelectedAppliance = useActiveApplianceStore((state) => state.setSelectedAppliance);
  
  const { appliances, selectedApplianceId } = useActiveApplianceStore(
    useShallow((state) => ({
      appliances: state.appliancesByLocation[locationId] ?? EMPTY_ARRAY,
      selectedApplianceId: state.selectedApplianceIdByLocation[locationId] ?? null
    }))
  );

  const query = useQuery({
    queryKey: ['active-appliances', locationId],
    queryFn: () => activeApplianceApi.getActiveAppliances(locationId),
    enabled: Boolean(locationId),
  });

  useEffect(() => {
    // Check if lengths are different OR any ID is different to avoid double-syncing identical API data
    const isDataDifferent = !query.data || query.data.length !== appliances.length || 
      query.data.some((app: any, i: number) => app.applianceId !== appliances[i]?.applianceId);

    if (query.data && isDataDifferent) {
      setAppliancesForLocation(locationId, query.data);
    }
  }, [locationId, query.data, appliances, setAppliancesForLocation]);

  const selectedAppliance = useMemo(
    () => appliances.find((appliance) => appliance.applianceId === selectedApplianceId) ?? null,
    [appliances, selectedApplianceId]
  );

  return useMemo(() => ({
    ...query,
    appliances,
    selectedAppliance,
    selectedApplianceId,
    onSelectAppliance: (applianceId: string) => setSelectedAppliance(locationId, applianceId),
  }), [query, appliances, selectedAppliance, selectedApplianceId, locationId, setSelectedAppliance]);
}

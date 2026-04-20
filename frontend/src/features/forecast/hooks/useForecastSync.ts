import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { forecastApi } from '../api/forecast.api';
import { useForecastStore } from '../store/useForecastStore';

export function useForecastSync(locationId: string) {
  const setForecastForLocation = useForecastStore((state) => state.setForecastForLocation);
  const cachedForecast = useForecastStore(
    useShallow((state) => state.forecastByLocation[locationId])
  );

  const query = useQuery({
    queryKey: ['forecast', locationId],
    queryFn: () => forecastApi.getForecastByLocation(locationId),
    enabled: Boolean(locationId),
  });

  useEffect(() => {
    if (query.data && JSON.stringify(query.data) !== JSON.stringify(cachedForecast)) {
      setForecastForLocation(locationId, query.data);
    }
  }, [locationId, query.data, cachedForecast, setForecastForLocation]);

  return useMemo(() => ({
    ...query,
    forecast: cachedForecast ?? query.data,
  }), [query, cachedForecast]);
}

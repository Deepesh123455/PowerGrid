import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../api/locations.api';

export const locationsKeys = {
  all: ['locations'] as const,
  byUser: (userId: string) => [...locationsKeys.all, userId] as const,
};

export const useLocations = (userId: string | undefined) => {
  return useQuery({
    queryKey: locationsKeys.byUser(userId || 'unknown'),
    queryFn: () => locationsApi.getLocationsByUserId(userId as string),
    enabled: !!userId,
  });
};

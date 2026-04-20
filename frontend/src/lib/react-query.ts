import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Don't refetch automatically when tab gets focus
            retry: 1, // Only retry failed requests once
            staleTime: 5 * 60 * 1000, // 5 minutes by default
        },
    },
});

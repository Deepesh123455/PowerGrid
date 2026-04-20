import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (phoneNumber: string) => authApi.login({ phoneNumber }),
    onSuccess: (response) => {
      setSession(response.data.user, response.data.accessToken);
    },
  });
}

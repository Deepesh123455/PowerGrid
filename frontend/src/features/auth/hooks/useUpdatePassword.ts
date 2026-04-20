import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (newPassword: string) => authApi.updatePassword({ newPassword }),
  });
}

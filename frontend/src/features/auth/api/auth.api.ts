import { apiClient } from '../../../lib/axios';
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from '../types/auth.types';

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  async refresh(): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh');
    return response.data;
  },

  async updatePassword(payload: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
    const response = await apiClient.put<UpdatePasswordResponse>('/auth/update-password', payload);
    return response.data;
  },
};

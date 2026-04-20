export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface LoginRequest {
  phoneNumber: string;
}

export interface LoginResponse {
  status: 'success' | 'error';
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface RefreshResponse {
  status: 'success' | 'error';
  accessToken: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
}

export interface UpdatePasswordResponse {
  status: 'success' | 'error';
  message: string;
}

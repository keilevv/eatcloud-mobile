import { apiClient } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials,
    );
    return data.data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(
      '/auth/me',
    );
    return data.data.user;
  },
};

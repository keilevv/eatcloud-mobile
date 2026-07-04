import axios from 'axios';
import { env } from '../config/env';
import { authStorage } from '../storage/auth.storage';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await authStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  message: string;
  statusCode?: number;
  errors: string[];
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; errors?: Array<string | { field: string; message: string }> }
      | undefined;
    return {
      message: responseData?.message ?? error.message ?? 'Request failed',
      statusCode: error.response?.status,
      errors: Array.isArray(responseData?.errors)
        ? responseData.errors.map((item) =>
            typeof item === 'string' ? item : item.message,
          )
        : [],
    };
  }
  if (error instanceof Error) {
    return { message: error.message, errors: [] };
  }
  return { message: 'An unexpected error occurred', errors: [] };
};

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService, LoginCredentials, User } from '../services/auth.service';
import { authStorage } from '../storage/auth.storage';
import { normalizeApiError } from '../services/api';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = await authStorage.getToken();
      if (!token) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
        }));
        return;
      }
      const user = await authService.getCurrentUser();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      await authStorage.clearSession();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please login again.',
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { token, user } = await authService.login(credentials);
      await authStorage.setToken(token);
      await authStorage.setUser(JSON.stringify(user));
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const normalized = normalizeApiError(error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: normalized.message || 'Login failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authStorage.clearSession();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

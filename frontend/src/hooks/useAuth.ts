import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

const STORAGE_KEY = 'auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthState;
        setAuthState(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = useCallback((token: string, user: User) => {
    const newState: AuthState = { token, user };
    setAuthState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const logout = useCallback(() => {
    setAuthState({ token: null, user: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAuthenticated = authState.token !== null;

  const getAuthHeader = useCallback(() => {
    if (!authState.token) return {};
    return { Authorization: `Bearer ${authState.token}` };
  }, [authState.token]);

  return {
    ...authState,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
  };
}

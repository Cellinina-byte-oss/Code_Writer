import { createContext, useContext, ReactNode } from 'react';
import { useAuth, User, AuthState } from '../hooks/useAuth';

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Auth from './pages/Auth';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />

      <Route path="/practice" element={
        <ProtectedRoute>
          <Practice />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

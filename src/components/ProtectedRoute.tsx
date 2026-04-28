import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user?.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;

  return children;
}

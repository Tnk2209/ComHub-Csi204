import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'Admin') return <Navigate to="/login" replace />;

  return children;
}

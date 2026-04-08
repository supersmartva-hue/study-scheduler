import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function PublicRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

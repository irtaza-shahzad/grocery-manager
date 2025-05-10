// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { getTokenPayload } from '../utils/auth';

const ProtectedRoute = ({ children, role }) => {
  const payload = getTokenPayload();

  if (!payload) return <Navigate to="/login" replace />;
  if (role && payload.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;

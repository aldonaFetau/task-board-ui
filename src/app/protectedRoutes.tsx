import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth/authContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />; //to remember the route the user wanted to access for post-login redirect.
  }
  return <Outlet />;
}

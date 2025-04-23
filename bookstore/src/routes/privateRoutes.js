import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user is authenticated and has required role
  const hasRequiredRole =
    allowedRoles.length === 0 || (user && allowedRoles.includes(user.role));

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    // Redirect to home if authenticated but doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "../utils/jwtUtils";

const PrivateRoutes = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, userInfo } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Kiểm tra token có hợp lệ không
  const isValidToken = user?.token && !isTokenExpired(user.token);

  // Nếu không authenticated hoặc token không hợp lệ
  if (!isAuthenticated || !isValidToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Lấy role từ userInfo
  const userRole = userInfo?.role || "customer";

  // Check if user has required role
  const hasRequiredRole =
    allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    // Redirect to home if authenticated but doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;

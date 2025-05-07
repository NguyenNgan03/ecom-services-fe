import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoutes from "./privateRoutes";
import PublicRoutes from "./publicRoutes";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const CategoryProducts = lazy(() => import("../pages/CategoryProducts"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile")); // Import trang Profile
const NotFound = lazy(() => import("../pages/NotFound"));

// Admin pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ProductManagement = lazy(() =>
  import("../pages/Dashboard/ProductManagement")
);
const CategoryManagement = lazy(() =>
  import("../pages/Dashboard/CategoryManagement")
);
const CustomerManagement = lazy(() =>
  import("../pages/Dashboard/CustomerManagement")
);
const RoleManagement = lazy(() => import("../pages/Dashboard/RoleManagement")); // Import trang quản lý vai trò

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/category/:categoryId"
              element={<CategoryProducts />}
            />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Private Routes - User */}
        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Private Routes - Admin Only */}
        <Route element={<PrivateRoutes allowedRoles={["ADMIN", "admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/customers" element={<CustomerManagement />} />
            <Route path="/admin/roles" element={<RoleManagement />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

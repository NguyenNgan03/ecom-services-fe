"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { fetchRoles } from "../../store/slices/roleSlice";
import Card from "../../components/ui/Card";
import {
  ShoppingBag,
  Tag,
  Users,
  DollarSign,
  Package,
  BookOpen,
  ShoppingCart,
  Star,
  AlertTriangle,
  Shield,
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { users } = useSelector((state) => state.users);
  const { roles } = useSelector((state) => state.roles || { roles: [] });

  const [salesData, setSalesData] = useState({
    totalSales: 0,
    monthlySales: 0,
    orderCount: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchUsers());
    dispatch(fetchRoles());

    // Simulate fetching sales data
    setSalesData({
      totalSales: 24850000,
      monthlySales: 3750000,
      orderCount: 128,
      pendingOrders: 12,
    });
  }, [dispatch]);

  // Calculate some stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = users.length;
  const totalRoles = roles.length;
  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  ).length;
  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  // Top selling products (simulated)
  const topSellingProducts = products
    .slice(0, 5)
    .map((product) => ({
      ...product,
      soldCount: Math.floor(Math.random() * 50) + 10,
    }))
    .sort((a, b) => b.soldCount - a.soldCount);

  // Recent orders (simulated)
  const recentOrders = [
    {
      id: "ORD-2025-001",
      customer: "Nguyễn Văn A",
      date: "07/05/2025",
      total: 450000,
      status: "completed",
    },
    {
      id: "ORD-2025-002",
      customer: "Trần Thị B",
      date: "06/05/2025",
      total: 780000,
      status: "processing",
    },
    {
      id: "ORD-2025-003",
      customer: "Lê Văn C",
      date: "05/05/2025",
      total: 320000,
      status: "pending",
    },
    {
      id: "ORD-2025-004",
      customer: "Phạm Thị D",
      date: "04/05/2025",
      total: 560000,
      status: "completed",
    },
  ];

  return (
    <div className="bg-[#F5ECD5] p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#626F47]">
          Tổng quan hệ thống
        </h1>
        <p className="text-[#A4B465]">
          Chào mừng đến với trang quản trị BookStore
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="mr-4 p-3 rounded-full bg-blue-100">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-[#626F47]">
              {salesData.totalSales.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-xs text-green-600">+12% so với tháng trước</p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="mr-4 p-3 rounded-full bg-green-100">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
            <p className="text-2xl font-bold text-[#626F47]">
              {salesData.monthlySales.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-xs text-green-600">+8% so với tháng trước</p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="mr-4 p-3 rounded-full bg-purple-100">
            <Package className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-[#626F47]">
              {salesData.orderCount}
            </p>
            <p className="text-xs text-green-600">+15% so với tháng trước</p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="mr-4 p-3 rounded-full bg-amber-100">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Đơn chờ xử lý</p>
            <p className="text-2xl font-bold text-[#626F47]">
              {salesData.pendingOrders}
            </p>
            <p className="text-xs text-amber-600">Cần xử lý ngay</p>
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-[#F8F5EB]">
          <div className="mr-4 p-3 rounded-full bg-[#F0BB78]/20">
            <BookOpen className="h-6 w-6 text-[#F0BB78]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
            <p className="text-xl font-bold text-[#626F47]">{totalProducts}</p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-[#F8F5EB]">
          <div className="mr-4 p-3 rounded-full bg-[#A4B465]/20">
            <Tag className="h-6 w-6 text-[#A4B465]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
            <p className="text-xl font-bold text-[#626F47]">
              {totalCategories}
            </p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-[#F8F5EB]">
          <div className="mr-4 p-3 rounded-full bg-[#626F47]/20">
            <Users className="h-6 w-6 text-[#626F47]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
            <p className="text-xl font-bold text-[#626F47]">{totalUsers}</p>
          </div>
        </Card>

        <Card className="flex items-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-[#F8F5EB]">
          <div className="mr-4 p-3 rounded-full bg-red-100">
            <ShoppingBag className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Hết hàng</p>
            <p className="text-xl font-bold text-[#626F47]">
              {outOfStockProducts}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <Card.Header className="bg-[#626F47] text-white">
            <h2 className="text-lg font-medium">Đơn hàng gần đây</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mã đơn
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Tổng tiền
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#626F47]">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                        {order.total.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : order.status === "processing"
                            ? "Đang xử lý"
                            : "Chờ xác nhận"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/admin/orders"
                className="text-[#A4B465] hover:text-[#626F47] text-sm font-medium"
              >
                Xem tất cả đơn hàng →
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Top Selling Products */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <Card.Header className="bg-[#626F47] text-white">
            <h2 className="text-lg font-medium">Sản phẩm bán chạy</h2>
          </Card.Header>
          <Card.Body className="p-0">
            <ul className="divide-y divide-gray-200">
              {topSellingProducts.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-4 flex items-center hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      src={product.imageUrl || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-[#626F47] truncate">
                        {product.name}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {product.price?.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-xs text-gray-500 ml-1">
                          {product.averageRating || 4.5}
                        </span>
                      </div>
                      <p className="text-xs text-green-600">
                        Đã bán: {product.soldCount}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/admin/products"
                className="text-[#A4B465] hover:text-[#626F47] text-sm font-medium"
              >
                Xem tất cả sản phẩm →
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <Card.Header className="bg-[#626F47] text-white">
            <h2 className="text-lg font-medium">Thao tác nhanh</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/products"
                className="flex items-center p-3 bg-gray-50 hover:bg-[#F5ECD5] hover:text-[#626F47] rounded-md transition-colors duration-300"
              >
                <BookOpen className="h-5 w-5 mr-2 text-[#A4B465]" />
                <span>Quản lý sản phẩm</span>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center p-3 bg-gray-50 hover:bg-[#F5ECD5] hover:text-[#626F47] rounded-md transition-colors duration-300"
              >
                <Tag className="h-5 w-5 mr-2 text-[#A4B465]" />
                <span>Quản lý danh mục</span>
              </Link>
              <Link
                to="/admin/customers"
                className="flex items-center p-3 bg-gray-50 hover:bg-[#F5ECD5] hover:text-[#626F47] rounded-md transition-colors duration-300"
              >
                <Users className="h-5 w-5 mr-2 text-[#A4B465]" />
                <span>Quản lý người dùng</span>
              </Link>
              <Link
                to="/admin/roles"
                className="flex items-center p-3 bg-gray-50 hover:bg-[#F5ECD5] hover:text-[#626F47] rounded-md transition-colors duration-300"
              >
                <Shield className="h-5 w-5 mr-2 text-[#A4B465]" />
                <span>Quản lý vai trò</span>
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <Card.Header className="bg-[#626F47] text-white">
            <h2 className="text-lg font-medium">Thống kê</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sản phẩm nổi bật</span>
                <span className="font-medium text-[#626F47]">
                  {featuredProducts}/{totalProducts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#A4B465] h-2.5 rounded-full"
                  style={{
                    width: `${
                      totalProducts > 0
                        ? Math.round((featuredProducts / totalProducts) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-600">Tỷ lệ hàng tồn kho</span>
                <span className="font-medium text-[#626F47]">
                  {outOfStockProducts}/{totalProducts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      totalProducts > 0
                        ? Math.round((outOfStockProducts / totalProducts) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-600">Tỷ lệ hoàn thành đơn hàng</span>
                <span className="font-medium text-[#626F47]">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#F0BB78] h-2.5 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

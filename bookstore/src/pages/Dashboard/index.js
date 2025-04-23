"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchUsers } from "../../store/slices/userSlice";
import Card from "../../components/ui/Card";
import {
  ShoppingBag,
  Tag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate some stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = users.length;
  const totalRevenue = products.reduce(
    (sum, product) => sum + (product.price || 0),
    0
  );
  const outOfStockProducts = products.filter(
    (product) => !product.stocked
  ).length;

  const stats = [
    {
      name: "Total Products",
      value: totalProducts,
      icon: <Package className="h-8 w-8 text-blue-500" />,
    },
    {
      name: "Total Categories",
      value: totalCategories,
      icon: <Tag className="h-8 w-8 text-green-500" />,
    },
    {
      name: "Total Customers",
      value: totalUsers,
      icon: <Users className="h-8 w-8 text-purple-500" />,
    },
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
    },
    {
      name: "Out of Stock",
      value: outOfStockProducts,
      icon: <ShoppingBag className="h-8 w-8 text-red-500" />,
    },
    {
      name: "Sales Growth",
      value: "24%",
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center p-6">
            <div className="mr-4">{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2">
              <Link
                to="/admin/products/new"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                Add New Product
              </Link>
              <Link
                to="/admin/categories/new"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                Add New Category
              </Link>
              <Link
                to="/admin/products"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/customers"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                View Customers
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-medium">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    New product added
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    New customer registered
                  </p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Category updated
                  </p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

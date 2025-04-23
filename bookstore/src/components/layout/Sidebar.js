"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Tag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    { path: "/admin", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/admin/products", icon: <Package size={20} />, label: "Products" },
    { path: "/admin/categories", icon: <Tag size={20} />, label: "Categories" },
    { path: "/admin/customers", icon: <Users size={20} />, label: "Customers" },
    {
      path: "/admin/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">E-Shop Admin</span>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

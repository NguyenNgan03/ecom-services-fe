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
  Shield,
  BookOpen,
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
    { path: "/admin/products", icon: <Package size={20} />, label: "Sản phẩm" },
    { path: "/admin/categories", icon: <Tag size={20} />, label: "Danh mục" },
    {
      path: "/admin/customers",
      icon: <Users size={20} />,
      label: "Người dùng",
    },
    { path: "/admin/roles", icon: <Shield size={20} />, label: "Vai trò" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "Cài đặt" },
  ];

  return (
    <aside
      className={`bg-[#626F47] text-white h-full ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#A4B465]">
        {!collapsed && (
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-[#F0BB78]" />
            <span className="text-xl font-bold ml-2">BookStore</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full text-[#F5ECD5] hover:text-[#F0BB78] focus:outline-none transition-colors duration-300"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className="transform hover:translate-x-1 transition-transform duration-200"
            >
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-[#A4B465] text-white"
                    : "text-[#F5ECD5] hover:bg-[#A4B465]/50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && (
                  <span className="transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

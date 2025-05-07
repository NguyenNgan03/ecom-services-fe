"use client";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { LogOut, Bell, Search, Settings } from "lucide-react";

const AdminNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-[#626F47] text-white shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">BookStore Admin</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-[#526047] text-white placeholder-gray-300 pl-10 pr-4 py-1.5 rounded-md border border-[#A4B465] focus:outline-none focus:ring-2 focus:ring-[#F0BB78] w-64"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-[#F5ECD5] hover:bg-[#526047] transition-colors duration-300 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#F0BB78] rounded-full">
                3
              </span>
            </button>
            <button className="p-2 rounded-full text-[#F5ECD5] hover:bg-[#526047] transition-colors duration-300">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#F0BB78] flex items-center justify-center text-[#626F47] mr-2">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="text-[#F5ECD5] mr-4 hidden md:block">
                {user?.email || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-[#F5ECD5] hover:text-[#F0BB78] hover:bg-[#526047] transition-colors duration-300"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { ShoppingCart, Menu, X, ChevronDown, Book } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated, user, userInfo, isAdmin } = useSelector(
    (state) => state.auth
  );
  const { categories } = useSelector((state) => state.categories);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    setIsUserDropdownOpen(false); // Close user dropdown when opening category dropdown
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsDropdownOpen(false); // Close category dropdown when opening user dropdown
  };

  // Lấy tên hiển thị từ user
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Người dùng";
  };

  return (
    <nav className="bg-[#F5ECD5] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Book className="h-8 w-8 text-[#626F47]" />
              <span className="text-xl font-bold text-[#626F47] ml-2">
                BookStore
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-[#626F47] border-b-2 border-transparent hover:border-[#A4B465] hover:text-[#A4B465] transition-colors duration-300"
              >
                Trang chủ
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-[#626F47] border-b-2 border-transparent hover:border-[#A4B465] hover:text-[#A4B465] transition-colors duration-300"
                >
                  Danh mục
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out origin-top-right">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block px-4 py-2 text-sm text-[#626F47] hover:bg-[#F5ECD5] hover:text-[#A4B465] transition-colors duration-200"
                          role="menuitem"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link
              to="/cart"
              className="p-2 rounded-full text-[#626F47] hover:text-[#A4B465] hover:bg-[#F5ECD5] transition-colors duration-300 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#F0BB78] rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="ml-4 relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A4B465] transition-all duration-300"
                >
                  <div className="h-8 w-8 rounded-full bg-[#A4B465] flex items-center justify-center text-white">
                    {user?.firstName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </div>
                </button>
                {isUserDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out">
                    <div className="py-1">
                      <div className="block px-4 py-2 text-sm text-[#626F47] border-b border-gray-100">
                        Xin chào, {getDisplayName()}
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-[#626F47] hover:bg-[#F5ECD5] hover:text-[#A4B465] transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Quản trị viên
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-[#626F47] hover:bg-[#F5ECD5] hover:text-[#A4B465] transition-colors duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#626F47] hover:bg-[#F5ECD5] hover:text-[#A4B465] transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  to="/login"
                  className="text-[#626F47] hover:text-[#A4B465] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-[#A4B465] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#626F47] transition-colors duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <Link
              to="/cart"
              className="p-2 rounded-full text-[#626F47] hover:text-[#A4B465] relative mr-2"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#F0BB78] rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#626F47] hover:text-[#A4B465] hover:bg-[#F5ECD5] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#A4B465] transition-colors duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#F5ECD5] transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
              onClick={toggleMenu}
            >
              Trang chủ
            </Link>
            <button
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
              onClick={toggleDropdown}
            >
              Danh mục
              <ChevronDown
                className={`h-4 w-4 ml-1 inline-block transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="pl-4 transition-all duration-200 ease-in-out">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-[#A4B465]">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="px-3 py-2 text-base font-medium text-[#626F47]">
                  Xin chào, {getDisplayName()}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    Quản trị viên
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#626F47] hover:bg-[#A4B465] hover:text-white transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

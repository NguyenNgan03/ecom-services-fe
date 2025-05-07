"use client";

import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Book,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#626F47] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fadeIn" style={{ animationDelay: "0s" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Book className="h-6 w-6 mr-2" />
              BookStore
            </h2>
            <p className="text-[#F5ECD5] mb-4">
              Cửa hàng sách trực tuyến hàng đầu với đa dạng thể loại sách chất
              lượng cao với giá cả phải chăng.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 transform hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Đổi trả & Hoàn tiền
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#F5ECD5] hover:text-[#F0BB78] transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-lg font-semibold mb-4">
              Liên hệ với chúng tôi
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#F0BB78]" />
                <span className="text-[#F5ECD5]">
                  123 Đường Sách, Quận 1, TP.HCM
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#F0BB78]" />
                <span className="text-[#F5ECD5]">+84 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#F0BB78]" />
                <span className="text-[#F5ECD5]">info@bookstore.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#A4B465] text-center">
          <p className="text-[#F5ECD5]">
            &copy; {new Date().getFullYear()} BookStore. Tất cả quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

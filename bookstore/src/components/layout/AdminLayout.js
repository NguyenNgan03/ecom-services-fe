"use client";

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#626F47]">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5ECD5] p-4">
          <Outlet />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminLayout;

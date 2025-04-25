import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AdminLayout;

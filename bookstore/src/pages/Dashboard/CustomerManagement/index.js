"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../store/slices/userSlice";
import { fetchRoles } from "../../../store/slices/roleSlice";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import { Edit, Trash2, Search, Mail, Phone, Plus } from "lucide-react";

const CustomerManagement = () => {
  const dispatch = useDispatch();

  // Fix the selector to properly access the roles state
  const { users, loading, error } = useSelector((state) => state.users);
  const { roles = [], loading: rolesLoading = false } = useSelector(
    (state) => state.roles || {}
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());

    // Explicitly fetch roles when component mounts
    console.log("CustomerManagement component mounted, fetching roles");
    dispatch(fetchRoles())
      .unwrap()
      .then((roles) => {
        console.log("Roles fetched successfully in component:", roles);
      })
      .catch((error) => {
        console.error("Failed to fetch roles in component:", error);
        setAppError("Không thể tải danh sách vai trò. Vui lòng thử lại sau.");
      });
  }, [dispatch]);

  // Log roles to debug
  useEffect(() => {
    console.log("Available roles in state:", roles);
  }, [roles]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
  );

  const handleOpenModal = (user = null) => {
    // If roles aren't loaded yet, try to fetch them again
    if (!roles || roles.length === 0) {
      console.log("No roles available, fetching roles before opening modal");
      dispatch(fetchRoles());
    }

    if (user) {
      setCurrentUser(user);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "", // Không hiển thị mật khẩu
        phoneNumber: user.phoneNumber || "",
        roleId: user.roleId || "",
        isActive: user.isActive !== false, // Default to true if undefined
      });
    } else {
      setCurrentUser(null);
      // Find default customer role if available
      const customerRole = roles?.find(
        (role) =>
          role.name.toLowerCase() === "customer" ||
          role.name.toLowerCase() === "khách hàng"
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        roleId:
          customerRole?.id || (roles && roles.length > 0 ? roles[0].id : ""),
        isActive: true,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Tên là bắt buộc";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Họ là bắt buộc";
    }

    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!currentUser && !formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (!currentUser && formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.roleId) {
      errors.roleId = "Vai trò là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (currentUser) {
        // Nếu không nhập mật khẩu mới, không gửi trường password
        const userData = { ...formData };
        if (!userData.password) {
          delete userData.password;
        }

        dispatch(updateUser({ id: currentUser.id, userData }))
          .unwrap()
          .then(() => {
            setSuccessMessage("Cập nhật người dùng thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
            // Refresh user list
            dispatch(fetchUsers());
          })
          .catch((error) => {
            console.error("Failed to update user:", error);
            setAppError(
              `Không thể cập nhật người dùng: ${
                error.message || "Đã xảy ra lỗi"
              }`
            );
            setTimeout(() => setAppError(null), 5000);
          });
      } else {
        dispatch(createUser(formData))
          .unwrap()
          .then(() => {
            setSuccessMessage("Thêm người dùng thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
            // Refresh user list
            dispatch(fetchUsers());
          })
          .catch((error) => {
            console.error("Failed to create user:", error);
            setAppError(
              `Không thể thêm người dùng: ${error.message || "Đã xảy ra lỗi"}`
            );
            setTimeout(() => setAppError(null), 5000);
          });
      }
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmDelete(userId);
  };

  const confirmDeleteUser = () => {
    if (confirmDelete) {
      dispatch(deleteUser(confirmDelete))
        .unwrap()
        .then(() => {
          setSuccessMessage("Xóa người dùng thành công!");
          setConfirmDelete(null);
          setTimeout(() => setSuccessMessage(""), 3000);
          // Refresh user list
          dispatch(fetchUsers());
        })
        .catch((error) => {
          console.error("Failed to delete user:", error);
          setAppError(
            `Không thể xóa người dùng: ${error.message || "Đã xảy ra lỗi"}`
          );
          setTimeout(() => setAppError(null), 5000);
          setConfirmDelete(null);
        });
    }
  };

  // Force reload roles function
  const forceReloadRoles = () => {
    setAppError(null);
    dispatch(fetchRoles())
      .unwrap()
      .then((roles) => {
        console.log("Roles reloaded successfully:", roles);
        if (roles && roles.length > 0) {
          setSuccessMessage("Đã tải danh sách vai trò thành công!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      })
      .catch((error) => {
        console.error("Failed to reload roles:", error);
        setAppError("Không thể tải danh sách vai trò. Vui lòng thử lại sau.");
      });
  };

  return (
    <div className="bg-[#F5ECD5] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#626F47]">
            Quản lý người dùng
          </h1>
          <p className="text-[#A4B465]">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-[#A4B465] hover:bg-[#626F47] text-white transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-1" />
          Thêm người dùng
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {appError && (
        <Alert
          type="error"
          message={appError}
          className="mb-4"
          onClose={() => setAppError(null)}
        />
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          className="mb-4"
          onClose={() => setSuccessMessage("")}
        />
      )}

      <Card className="mb-6">
        <Card.Body>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-[#A4B465]"
            />
          </div>
        </Card.Body>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#626F47] text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Liên hệ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Vai trò
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A4B465]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy người dùng
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#F5ECD5] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#F0BB78] rounded-full text-white">
                          {user.firstName?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#626F47]">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-[#626F47]">
                          <Mail className="h-4 w-4 mr-1 text-[#A4B465]" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Phone className="h-4 w-4 mr-1 text-[#A4B465]" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#F0BB78] text-white">
                        {user.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-[#A4B465] hover:text-[#626F47] mr-3 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={formErrors.firstName}
                required
              />

              <Input
                label="Họ"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
                required
              />
            </div>

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              disabled={currentUser} // Không cho phép sửa email nếu đang chỉnh sửa
            />

            <Input
              label={
                currentUser
                  ? "Mật khẩu mới"
                  : "Mật khẩu"
              }
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required={!currentUser}
            />

            <Input
              label="Số điện thoại"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={formErrors.phoneNumber}
            />

            <div className="mb-4">
              <label
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-[#A4B465] ${
                    formErrors.roleId ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Chọn vai trò</option>
                  {rolesLoading ? (
                    <option disabled>Đang tải vai trò...</option>
                  ) : roles && roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có vai trò nào</option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={forceReloadRoles}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  title="Tải lại danh sách vai trò"
                >
                  ↻
                </button>
              </div>
              {formErrors.roleId && (
                <p className="mt-1 text-sm text-red-500">{formErrors.roleId}</p>
              )}
              {(!roles || roles.length === 0) && !rolesLoading && (
                <div className="mt-2">
                  <p className="mt-1 text-sm text-yellow-500">
                    Không thể tải danh sách vai trò. Vui lòng thử lại sau hoặc
                    tạo vai trò mới.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-[#A4B465] focus:ring-[#A4B465] border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-900"
              >
                Tài khoản hoạt động
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="border-[#A4B465] text-[#626F47]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#A4B465] hover:bg-[#626F47] text-white"
            >
              {loading ? "Đang lưu..." : currentUser ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Xác nhận xóa"
        size="sm"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
            hoàn tác.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
              className="border-[#A4B465] text-[#626F47]"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteUser}
              disabled={loading}
              className="bg-red-500 hover:bg-red-700 text-white"
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerManagement;

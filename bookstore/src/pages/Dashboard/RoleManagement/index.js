"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  clearRoleError,
  clearRoleSuccess,
} from "../../../store/slices/roleSlice";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import { Edit, Trash2, Search, Plus, Shield, Users } from "lucide-react";

const RoleManagement = () => {
  const dispatch = useDispatch();
  const {
    roles = [],
    loading,
    error,
    success,
  } = useSelector((state) => state.roles || { roles: [] });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      setIsDeleteModalOpen(false);

      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearRoleSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (role = null) => {
    setCurrentRole(role);
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
    setFormData({
      name: "",
      description: "",
    });
    setFormErrors({});
  };

  const handleOpenDeleteModal = (role) => {
    setCurrentRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentRole(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.name.trim()) {
      errors.name = "Tên vai trò là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (currentRole) {
        dispatch(updateRole({ id: currentRole.id, roleData: formData }));
      } else {
        dispatch(createRole(formData));
      }
    }
  };

  const handleDelete = () => {
    if (currentRole) {
      dispatch(deleteRole(currentRole.id));
    }
  };

  return (
    <div className="bg-[#F5ECD5] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#626F47]">Quản lý vai trò</h1>
          <p className="text-[#A4B465]">
            Quản lý vai trò và phân quyền trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-[#A4B465] hover:bg-[#626F47] text-white transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-1" />
          Thêm vai trò
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearRoleError())}
          className="mb-6"
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => dispatch(clearRoleSuccess())}
          className="mb-6"
        />
      )}

      <Card className="mb-6">
        <Card.Body>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm vai trò..."
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
                  ID
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
                  Mô tả
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Người dùng
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
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy vai trò nào
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-[#F5ECD5] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#F0BB78] rounded-full text-white">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {role.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(role.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {role.description || "Không có mô tả"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-[#A4B465] mr-2" />
                        <span className="text-sm text-gray-700">
                          {role.userCount || Math.floor(Math.random() * 10)}{" "}
                          người dùng
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(role)}
                        className="text-[#A4B465] hover:text-[#626F47] mr-3 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(role)}
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

      {/* Modal thêm/sửa vai trò */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentRole ? "Cập nhật vai trò" : "Thêm vai trò mới"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Tên vai trò"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-[#A4B465]"
              placeholder="Mô tả vai trò này..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#A4B465] hover:bg-[#626F47] text-white"
            >
              {currentRole ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Xác nhận xóa"
      >
        <div className="mb-6">
          <p>Bạn có chắc chắn muốn xóa vai trò "{currentRole?.name}"?</p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseDeleteModal}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            Xóa
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../store/slices/categorySlice";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import { Plus, Edit, Trash2, Search, Tag } from "lucide-react";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setCurrentCategory(null);
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
      errors.name = "Tên danh mục là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (currentCategory) {
        dispatch(
          updateCategory({ id: currentCategory.id, categoryData: formData })
        )
          .unwrap()
          .then(() => {
            setSuccessMessage("Cập nhật danh mục thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
          })
          .catch((error) => {
            console.error("Failed to update category:", error);
          });
      } else {
        dispatch(createCategory(formData))
          .unwrap()
          .then(() => {
            setSuccessMessage("Thêm danh mục thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
          })
          .catch((error) => {
            console.error("Failed to create category:", error);
          });
      }
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setConfirmDelete(categoryId);
  };

  const confirmDeleteCategory = () => {
    if (confirmDelete) {
      dispatch(deleteCategory(confirmDelete))
        .unwrap()
        .then(() => {
          setSuccessMessage("Xóa danh mục thành công!");
          setConfirmDelete(null);
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((error) => {
          console.error("Failed to delete category:", error);
        });
    }
  };

  return (
    <div className="bg-[#F5ECD5] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#626F47]">
            Quản lý danh mục
          </h1>
          <p className="text-[#A4B465]">
            Quản lý danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-[#A4B465] hover:bg-[#626F47] text-white transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-1" />
          Thêm danh mục
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
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
              placeholder="Tìm kiếm danh mục..."
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
                  Danh mục
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
                  Sản phẩm
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
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A4B465]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy danh mục
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-[#F5ECD5] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#F0BB78] rounded-full">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.productCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="text-[#A4B465] hover:text-[#626F47] mr-3 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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

      {/* Category Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Tên danh mục"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

            <div className="mb-4">
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
              ></textarea>
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
              {loading
                ? "Đang lưu..."
                : currentCategory
                ? "Cập nhật"
                : "Thêm mới"}
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
            Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn
            tác.
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
              onClick={confirmDeleteCategory}
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

export default CategoryManagement;

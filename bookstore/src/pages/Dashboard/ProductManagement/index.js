"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../store/slices/productSlice";
import { fetchCategories } from "../../../store/slices/categorySlice";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    stock: 0,
    featured: false,
    author: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [setError, setAppError] = useState(null);

  useEffect(() => {
    // Pass fetchAll: true to get all products, not just featured ones
    dispatch(fetchProducts({ fetchAll: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        image: product.imageUrl || "",
        stock: product.stock || 0,
        featured: product.featured || false,
        author: product.author || "",
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        image: "",
        stock: 0,
        featured: false,
        author: "",
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

    if (!formData.name.trim()) {
      errors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    }

    if (!formData.price) {
      errors.price = "Giá là bắt buộc";
    } else if (
      isNaN(Number.parseFloat(formData.price)) ||
      Number.parseFloat(formData.price) <= 0
    ) {
      errors.price = "Giá phải là số dương";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Danh mục là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      };

      if (currentProduct) {
        dispatch(updateProduct({ id: currentProduct.id, productData }))
          .unwrap()
          .then(() => {
            setSuccessMessage("Cập nhật sản phẩm thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
            // Refresh product list after successful update
            dispatch(fetchProducts());
          })
          .catch((error) => {
            console.error("Failed to update product:", error);
            setAppError(
              `Không thể cập nhật sản phẩm: ${
                error.message ||
                "Lỗi quyền truy cập. Vui lòng kiểm tra quyền admin của bạn."
              }`
            );
            setTimeout(() => setAppError(null), 5000);
          });
      } else {
        dispatch(createProduct(productData))
          .unwrap()
          .then(() => {
            setSuccessMessage("Thêm sản phẩm thành công!");
            handleCloseModal();
            setTimeout(() => setSuccessMessage(""), 3000);
            // Refresh product list after successful creation
            dispatch(fetchProducts());
          })
          .catch((error) => {
            console.error("Failed to create product:", error);
            setAppError(
              `Không thể thêm sản phẩm: ${
                error.message ||
                "Lỗi quyền truy cập. Vui lòng kiểm tra quyền admin của bạn."
              }`
            );
            setTimeout(() => setAppError(null), 5000);
          });
      }
    }
  };

  const handleDeleteProduct = (productId) => {
    setConfirmDelete(productId);
  };

  const confirmDeleteProduct = () => {
    if (confirmDelete) {
      dispatch(deleteProduct(confirmDelete))
        .unwrap()
        .then(() => {
          setSuccessMessage("Xóa sản phẩm thành công!");
          setConfirmDelete(null);
          setTimeout(() => setSuccessMessage(""), 3000);
          // Refresh product list after successful deletion
          dispatch(fetchProducts());
        })
        .catch((error) => {
          console.error("Failed to delete product:", error);
          setAppError(
            `Không thể xóa sản phẩm: ${
              error.message ||
              "Lỗi quyền truy cập. Vui lòng kiểm tra quyền admin của bạn."
            }`
          );
          setConfirmDelete(null);
          setTimeout(() => setAppError(null), 5000);
        });
    }
  };

  return (
    <div className="bg-[#F5ECD5] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#626F47]">
            Quản lý sản phẩm
          </h1>
          <p className="text-[#A4B465]">
            Quản lý danh sách sản phẩm trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-[#A4B465] hover:bg-[#626F47] text-white transition-colors duration-300"
        >
          <Plus className="h-5 w-5 mr-1" />
          Thêm sản phẩm
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
              placeholder="Tìm kiếm sản phẩm..."
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
                  Sản phẩm
                </th>
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
                  Giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Nổi bật
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
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A4B465]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy sản phẩm
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#F5ECD5] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.imageUrl || "/placeholder-product.jpg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#626F47]">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {categories.find((c) => c.id === product.categoryId)
                          ?.name || "Không xác định"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.price?.toLocaleString("vi-VN")} đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.featured
                            ? "bg-[#F0BB78] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.featured ? "Nổi bật" : "Không"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-[#A4B465] hover:text-[#626F47] mr-3 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Tên sản phẩm"
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
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-[#A4B465] ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                required
              ></textarea>
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Giá (VNĐ)"
                id="price"
                name="price"
                type="number"
                step="1000"
                min="0"
                value={formData.price}
                onChange={handleChange}
                error={formErrors.price}
                required
              />

              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-[#A4B465] ${
                    formErrors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.categoryId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Số lượng"
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
              />

              <Input
                label="Tác giả"
                id="author"
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                placeholder="Tên tác giả"
              />
            </div>

            <Input
              label="URL hình ảnh"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#A4B465] focus:ring-[#A4B465] border-gray-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Sản phẩm nổi bật
                </label>
              </div>
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
                : currentProduct
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
            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn
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
              onClick={confirmDeleteProduct}
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

export default ProductManagement;

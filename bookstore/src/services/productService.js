import api from "../config/axios";

const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get("/api/products");
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/api/products/category/${categoryId}`);
    return response.data;
  },

  // Get product by id
  getProductById: async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  },

  // Get product details with reviews
  getProductDetails: async (productId) => {
    const response = await api.get(`/api/products/${productId}/details`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post("/api/products", productData);
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/api/products/${productId}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get("/api/products/featured");
    return response.data;
  },
};

export default productService;

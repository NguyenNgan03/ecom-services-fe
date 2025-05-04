import api from "../config/axios";

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get("api/categories");
    return response.data;
  },

  // Get category by id
  getCategoryById: async (categoryId) => {
    const response = await api.get(`api/categories/${categoryId}`);
    return response.data;
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post("api/categories", categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`api/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`api/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;

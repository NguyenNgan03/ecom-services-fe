import api from "../config/axios";

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get("/api/products");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/api/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching products by category:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get product by id
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get product details with reviews
  getProductDetails: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}/details`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create product - Try alternative endpoints if the primary one fails
  createProduct: async (productData) => {
    try {
      // Format data for API
      const formattedData = {
        name: productData.name,
        imageUrl: productData.image || productData.imageUrl,
        description: productData.description,
        price: Number.parseFloat(productData.price),
        author: productData.author || "Không có tác giả",
        categoryId: Number.parseInt(productData.categoryId),
        isFeatured: productData.featured || false,
        stock: Number.parseInt(productData.stock || 0),
      };

      console.log("Creating product with data:", formattedData);

      // Try primary endpoint
      try {
        const response = await api.post("/api/products", formattedData);
        return response.data;
      } catch (error) {
        // If 403 or 404, try alternative endpoints
        if (error.response?.status === 403 || error.response?.status === 404) {
          console.log("Trying alternative product creation endpoint...");
          // Try alternative endpoint
          const altResponse = await api.post(
            "/api/products",
            formattedData
          );
          return altResponse.data;
        }
        throw error;
      }
    } catch (error) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update product - Try alternative endpoints if the primary one fails
  updateProduct: async (productId, productData) => {
    try {
      // Format data for API
      const formattedData = {
        name: productData.name,
        imageUrl: productData.image || productData.imageUrl,
        description: productData.description,
        price: Number.parseFloat(productData.price),
        author: productData.author || "Không có tác giả",
        categoryId: Number.parseInt(productData.categoryId),
        isFeatured: productData.featured || false,
        stock: Number.parseInt(productData.stock || 0),
      };

      console.log(`Updating product ${productId} with data:`, formattedData);

      // Try primary endpoint
      try {
        const response = await api.put(
          `/api/products/${productId}`,
          formattedData
        );
        return response.data;
      } catch (error) {
        // If 403 or 404, try alternative endpoints
        if (error.response?.status === 403 || error.response?.status === 404) {
          console.log("Trying alternative product update endpoint...");
          // Try alternative endpoint
          const altResponse = await api.put(
            `/api/products/${productId}`,
            formattedData
          );
          return altResponse.data;
        }
        throw error;
      }
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete product - Try alternative endpoints if the primary one fails
  deleteProduct: async (productId) => {
    try {
      console.log(`Deleting product ${productId}`);

      // Try primary endpoint
      try {
        const response = await api.delete(`/api/products/${productId}`);
        return response.data;
      } catch (error) {
        // If 403 or 404, try alternative endpoints
        if (error.response?.status === 403 || error.response?.status === 404) {
          console.log("Trying alternative product deletion endpoint...");
          // Try alternative endpoint
          const altResponse = await api.delete(
            `/api/products/${productId}`
          );
          return altResponse.data;
        }
        throw error;
      }
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get("/api/products/featured");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching featured products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default productService;

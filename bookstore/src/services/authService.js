import api from "../config/axios";

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    localStorage.removeItem("user");
    return null;
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

export default authService;

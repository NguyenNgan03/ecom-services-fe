import api from "../config/axios";

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Get user by id
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;

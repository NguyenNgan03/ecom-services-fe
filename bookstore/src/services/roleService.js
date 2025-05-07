import api from "../config/axios";

const roleService = {
  // Lấy tất cả vai trò
  getAllRoles: async () => {
    try {
      console.log("Fetching roles from /api/roles");
      const response = await api.get("/api/roles");
      console.log("Roles API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error.response || error.message);
      throw error;
    }
  },

  // Lấy vai trò theo ID
  getRoleById: async (roleId) => {
    try {
      const response = await api.get(`/api/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      throw error;
    }
  },

  // Tạo vai trò mới (admin only)
  createRole: async (roleData) => {
    try {
      const response = await api.post("/api/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  },

  // Cập nhật vai trò (admin only)
  updateRole: async (roleId, roleData) => {
    try {
      const response = await api.put(`/api/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  },

  // Xóa vai trò (admin only)
  deleteRole: async (roleId) => {
    try {
      const response = await api.delete(`/api/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  },
};

export default roleService;

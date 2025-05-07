import api from "../config/axios";
import axios from "axios";

const userService = {
  // Lấy thông tin người dùng hiện tại (từ token)
  getCurrentUserProfile: async () => {
    try {
      // Lấy thông tin user từ localStorage
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        console.error("No user token found in localStorage");
        throw new Error(
          "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
        );
      }

      // Log thông tin token để debug
      console.log("Token type:", user.type);
      console.log("Token first 10 chars:", user.token.substring(0, 10) + "...");

      // Try different API endpoints that might work
      const possibleEndpoints = [
        "/api/users/profile",
        "/api/users/me",
        "/api/user/profile",
        "/api/user",
        "/api/auth/me",
        "/api/profile",
      ];

      // Try each endpoint
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await axios.get(`http://localhost:8080${endpoint}`, {
            headers: {
              Authorization: `${user.type} ${user.token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 200) {
            console.log(`Success with endpoint: ${endpoint}`);
            return response.data;
          }
        } catch (endpointError) {
          console.log(
            `Failed with endpoint ${endpoint}: ${endpointError.response?.status}`
          );
          // Continue to next endpoint
        }
      }

      // If we get here, all endpoints failed
      throw new Error("All profile endpoints failed");
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // Return a basic profile from localStorage as fallback
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        return {
          email: user.email,
          firstName: "",
          lastName: "",
          phoneNumber: "",
          roleName: user.role || "customer",
        };
      }

      throw error;
    }
  },

  // Cập nhật thông tin người dùng hiện tại
  updateCurrentUserProfile: async (userData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.put("/api/users/profile", userData, {
        headers: {
          Authorization: `${user.type} ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(
        "/api/users/change-password",
        passwordData,
        {
          headers: {
            Authorization: `${user.type} ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // ADMIN ONLY FUNCTIONS

  // Lấy tất cả người dùng (admin only)
  getAllUsers: async () => {
    const response = await api.get("/api/users");
    return response.data;
  },

  // Lấy người dùng theo ID (admin only)
  getUserById: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // Tạo người dùng mới (admin only)
  createUser: async (userData) => {
    const response = await api.post("/api/users", userData);
    return response.data;
  },

  // Cập nhật người dùng (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  // Xóa người dùng (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  },
};

export default userService;

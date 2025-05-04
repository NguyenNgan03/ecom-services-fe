import axios from "axios";

const authService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      credentials,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data && response.data.token) {
      // Lưu thông tin user vào localStorage
      const userData = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        email: response.data.email,
        role: response.data.role,
        type: response.data.type,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data && response.data.token) {
      // Lưu thông tin user vào localStorage
      const userData = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        email: response.data.email,
        role: response.data.role,
        type: response.data.type,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },

  // Làm mới token
  refreshToken: async (refreshToken) => {
    // Sử dụng axios trực tiếp thay vì api instance để tránh vòng lặp
    const response = await axios.post(
      "http://localhost:8080/api/auth/refresh-token",
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.token) {
      // Cập nhật token mới vào localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...user,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      // Gọi API đăng xuất nếu có
      // await api.post("/api/auth/logout")
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa thông tin user khỏi localStorage
      localStorage.removeItem("user");
    }
    return null;
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  // Lấy token từ localStorage
  getToken: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  },

  // Lấy refresh token từ localStorage
  getRefreshToken: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  },

  // Kiểm tra token có tồn tại không
  hasToken: () => {
    return !!authService.getToken();
  },
};

export default authService;

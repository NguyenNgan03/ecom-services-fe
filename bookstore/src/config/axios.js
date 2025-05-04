import axios from "axios";
import authService from "../services/authService";
import { isTokenExpired } from "../utils/jwtUtils";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Danh sách các endpoint không cần token (public APIs)
const publicEndpoints = [
  "/api/categories",
  "/api/products",
  "/api/products/featured",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh-token",
];

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý hàng đợi các request bị lỗi do token hết hạn
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Kiểm tra xem endpoint có phải là public không
const isPublicEndpoint = (url) => {
  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

// Add request interceptor for auth token
api.interceptors.request.use(
  async (config) => {
    // Không thêm token cho các endpoint public
    if (isPublicEndpoint(config.url)) {
      // Trường hợp đặc biệt: nếu là refresh token, không gửi token cũ
      if (config.url.includes("/api/auth/refresh-token")) {
        delete config.headers.Authorization;
        return config;
      }

      // Các API public khác, có thể gửi token nếu có và còn hạn
      const user = authService.getCurrentUser();
      if (user?.token && !isTokenExpired(user.token)) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    }

    // Xử lý cho các endpoint yêu cầu xác thực
    const user = authService.getCurrentUser();

    if (user?.token) {
      // Kiểm tra token sắp hết hạn không
      if (isTokenExpired(user.token)) {
        // Token đã hết hạn, thử refresh
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshToken = user.refreshToken;
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Gọi API refresh token mà không gửi token cũ
            const response = await axios.post(
              `${api.defaults.baseURL}/api/auth/refresh-token`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" } }
            );

            // Cập nhật token mới vào localStorage
            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;

            const updatedUser = {
              ...user,
              token: newToken,
              refreshToken: newRefreshToken,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Cập nhật token cho request hiện tại
            config.headers.Authorization = `Bearer ${newToken}`;

            // Xử lý hàng đợi các request khác
            processQueue(null, newToken);
          } catch (error) {
            processQueue(error, null);
            // Nếu refresh token thất bại, đăng xuất người dùng
            authService.logout();
            window.location.href = "/login";
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Đang refresh token, thêm request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      } else {
        // Token còn hạn, sử dụng bình thường
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi không phải 401 hoặc không có response, trả về lỗi
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu là API refresh token mà bị lỗi 401, đăng xuất luôn
    if (originalRequest.url.includes("/api/auth/refresh-token")) {
      authService.logout();
      window.location.href = "/login?session=expired";
      return Promise.reject(error);
    }

    // Nếu là API public, không cần refresh token
    if (
      isPublicEndpoint(originalRequest.url) &&
      !originalRequest.url.includes("/api/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa thử refresh token
    if (!originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đánh dấu request này đã thử refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Thử refresh token
        const user = authService.getCurrentUser();
        if (!user?.refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gọi API refresh token mà không gửi token cũ
        const response = await axios.post(
          `${api.defaults.baseURL}/api/auth/refresh-token`,
          { refreshToken: user.refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        // Cập nhật token mới vào localStorage
        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        const updatedUser = {
          ...user,
          token: newToken,
          refreshToken: newRefreshToken,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Cập nhật token cho request hiện tại
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Xử lý hàng đợi các request khác
        processQueue(null, newToken);
        isRefreshing = false;

        // Thử lại request ban đầu với token mới
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Nếu refresh token thất bại, đăng xuất người dùng
        authService.logout();
        window.location.href = "/login?session=expired";
        return Promise.reject(refreshError);
      }
    }

    // Nếu đã thử refresh token mà vẫn lỗi 401, đăng xuất
    authService.logout();
    window.location.href = "/login?session=expired";
    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    // Đảm bảo token được set với định dạng "Bearer <token>"
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { setAuthToken } from "../../config/axios";
import { getUserInfoFromToken } from "../../utils/jwtUtils";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await authService.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Làm mới token thất bại"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại"
      );
    }
  }
);

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
if (user?.token) {
  // Đảm bảo token được set khi khởi tạo ứng dụng
  setAuthToken(user.token);
}

// Lấy thông tin user từ token
const userInfo = user?.token ? getUserInfoFromToken(user.token) : null;

const initialState = {
  user: user || null,
  userInfo: userInfo || null,
  isAuthenticated: !!user?.token, // Chỉ authenticated khi có token
  isAdmin: userInfo?.role === "admin", // Kiểm tra quyền admin
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserInfo: (state) => {
      if (state.user?.token) {
        const userInfo = getUserInfoFromToken(state.user.token);
        state.userInfo = userInfo;
        state.isAdmin = userInfo?.role === "admin";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload?.token;
        state.user = action.payload;

        // Lấy thông tin user từ token
        if (action.payload?.token) {
          setAuthToken(action.payload.token);
          const userInfo = getUserInfoFromToken(action.payload.token);
          state.userInfo = userInfo;
          state.isAdmin = userInfo?.role === "admin";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload?.token;
        state.user = action.payload;

        // Lấy thông tin user từ token
        if (action.payload?.token) {
          setAuthToken(action.payload.token);
          const userInfo = getUserInfoFromToken(action.payload.token);
          state.userInfo = userInfo;
          state.isAdmin = userInfo?.role === "admin";
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        };

        // Cập nhật thông tin user từ token mới
        if (action.payload?.token) {
          setAuthToken(action.payload.token);
          const userInfo = getUserInfoFromToken(action.payload.token);
          state.userInfo = userInfo;
          state.isAdmin = userInfo?.role === "admin";
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        setAuthToken(null);
      });
  },
});

export const { clearError, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;

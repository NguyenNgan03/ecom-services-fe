import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "../../services/roleService";

// Async thunks
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching roles from thunk...");
      const roles = await roleService.getAllRoles();
      console.log("Roles fetched successfully:", roles);
      return roles;
    } catch (error) {
      console.error("Error fetching roles in thunk:", error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải danh sách vai trò"
      );
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const newRole = await roleService.createRole(roleData);
      return newRole;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tạo vai trò mới"
      );
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const updatedRole = await roleService.updateRole(id, roleData);
      return updatedRole;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể cập nhật vai trò"
      );
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể xóa vai trò"
      );
    }
  }
);

// Initial state with proper typing
const initialState = {
  roles: [],
  loading: false,
  error: null,
  success: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearRoleSuccess: (state) => {
      state.success = null;
    },
    // Add a manual way to set roles if API fails
    setRoles: (state, action) => {
      state.roles = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error(
          "Failed to fetch roles, setting fallback:",
          action.payload
        );
        // Set fallback roles if API fails
        if (!state.roles || state.roles.length === 0) {
          console.log("Setting fallback roles due to API failure");
          state.roles = [
            { id: 1, name: "admin" },
            { id: 2, name: "customer" },
          ];
        }
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        state.success = "Tạo vai trò mới thành công";
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.success = "Cập nhật vai trò thành công";
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        state.success = "Xóa vai trò thành công";
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoleError, clearRoleSuccess, setRoles } = roleSlice.actions;
export default roleSlice.reducer;

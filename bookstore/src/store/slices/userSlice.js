import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      return await userService.getUserById(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(id, userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

export const fetchCurrentUserProfile = createAsyncThunk(
  "users/fetchCurrentUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getCurrentUserProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const updateCurrentUserProfile = createAsyncThunk(
  "users/updateCurrentUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.updateCurrentUserProfile(userData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update profile"
      );
    }
  }
);

const initialState = {
  users: [],
  user: null,
  currentUserProfile: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.user = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current user profile
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.currentUserProfile = action.payload;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      // Update current user profile
      .addCase(updateCurrentUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.currentUserProfile = action.payload;
      })
      .addCase(updateCurrentUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { clearUserError, clearCurrentUser, clearProfileError } =
  userSlice.actions;
export default userSlice.reducer;

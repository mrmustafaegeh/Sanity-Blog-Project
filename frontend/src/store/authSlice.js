import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Get stored user & token
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// ======= REGISTER =======
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue, dispatch }) => {
    console.log("Starting registration for:", userData.email);

    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      console.log("Registration successful:", data.user.email);

      // Save user & token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Don't trigger any posts fetch here
      return data;
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ======= LOGIN =======
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ======= GET CURRENT USER =======
export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No token");

    try {
      const { data } = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch {
      return rejectWithValue("Session expired");
    }
  }
);

// ======= UPDATE PROFILE =======
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const { data } = await axios.patch(
        `${API_URL}/auth/update-profile`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...data.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ======= UPDATE PASSWORD =======
export const updateUserPassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const { data } = await axios.patch(
        `${API_URL}/auth/update-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update password"
      );
    }
  }
);

// ======= UPLOAD PROFILE IMAGE =======
export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (imageFile, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...data.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

// ======= LOGOUT =======
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      try {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // ignore
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
);

// ======= SLICE =======
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          ...action.payload.user,
          isAdmin: action.payload.user.role === "admin",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          ...action.payload.user,
          isAdmin: action.payload.user.role === "admin",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET CURRENT USER
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          isAdmin: action.payload.role === "admin",
        };
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.clear();
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PASSWORD
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false;
        // Password updated successfully
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD PROFILE IMAGE
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

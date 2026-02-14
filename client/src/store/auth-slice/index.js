
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// ✅ helper: convert backend _id into frontend id
const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    id: user._id, // ✅ now frontend will use user.id everywhere
  };
};

export const registerUser = createAsyncThunk("/auth/register", async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    formData,
    { withCredentials: true }
  );
  return response.data;
});

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    formData,
    { withCredentials: true }
  );
  return response.data;
});

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store,no-cache, must-revalidate,proxy-revalidate",
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success && action.payload?.user) {
          // ✅ normalize _id -> id
          state.user = normalizeUser(action.payload.user);
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.success && action.payload?.user) {
          // ✅ normalize _id -> id
          state.user = normalizeUser(action.payload.user);
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
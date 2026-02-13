

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

/* =========================
   ADD TO CART (FIXED)
========================= */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
        { userId, productId, quantity },
        { withCredentials: true }
      );

      // 🔥 IMPORTANT: reject if backend says failure
      if (!response.data.success) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Add to cart failed" }
      );
    }
  }
);

/* =========================
   FETCH CART ITEMS
========================= */
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

/* =========================
   DELETE CART ITEM
========================= */
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/delete/${userId}/${productId}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

/* =========================
   UPDATE CART QUANTITY
========================= */
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
        { userId, productId, quantity },
        { withCredentials: true }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: "Update failed" }
      );
    }
  }
);

/* =========================
   SLICE
========================= */
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,

  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- ADD TO CART ---------- */
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;

        // 🔥 DO NOT UPDATE STATE IF BACKEND FAILED
        if (!action.payload?.success) return;

        state.cartItems = action.payload.data.items;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })

      /* ---------- FETCH CART ---------- */
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data.items;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })

      /* ---------- DELETE ITEM ---------- */
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
      })

      /* ---------- UPDATE QTY ---------- */
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;

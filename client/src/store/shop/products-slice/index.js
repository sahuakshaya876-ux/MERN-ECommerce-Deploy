
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// 🔹 helper to normalize MongoDB _id → id
const normalizeProduct = (product) => ({
  ...product,
  id: product._id,
});

// ✅ helper to build correct query string
function buildQueryString(filterParams = {}, sortParams = "") {
  const params = new URLSearchParams();

  // add filters
  Object.entries(filterParams).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(",")); // ✅ category=women,kids
    }
  });

  // add sort
  if (sortParams) {
    params.set("sortBy", sortParams);
  }

  return params.toString();
}

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }) => {
    const queryString = buildQueryString(filterParams, sortParams);

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get?${queryString}`
    );

    const normalizedProducts = (result?.data?.data || []).map(normalizeProduct);

    return { ...result.data, data: normalizedProducts };
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
    );

    return { ...result.data, data: normalizeProduct(result.data.data) };
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;

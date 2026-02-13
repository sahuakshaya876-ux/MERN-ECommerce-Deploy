

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList:[],
  orderDetails:null
};

/* =========================
   CREATE NEW ORDER
========================= */
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder", // ✅ UNIQUE
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* =========================
   CAPTURE PAYMENT
========================= */
export const capturePayment = createAsyncThunk(
  "order/capturePayment", // ✅ UNIQUE (FIXED)
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
        { paymentId, payerId, orderId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllOrdersByUserId=createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async(userId)=>{
    const response=await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`,
  
    );

    return response.data;
  }
)

export const getOrderDetails=createAsyncThunk(
  "/order/getOrderDetails",
  async(id)=>{
    const response=await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`,
  
    );

    return response.data;
  }
)

/* =========================
   ORDER SLICE
========================= */
const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,

  reducers: {
    // ✅ RESET ORDER STATE AFTER PAYMENT
    resetOrderState: (state) => {
      state.approvalURL = null;
      state.orderId = null;
      state.isLoading = false;
    },
    resetOrderDetails:(state)=>{
      state.orderDetails=null;
    }
  },

  extraReducers: (builder) => {
    builder
      /* -------- CREATE ORDER -------- */
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload?.approvalURL || null;
        state.orderId = action.payload?.orderId || null;

        if (action.payload?.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        }
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })

      /* -------- CAPTURE PAYMENT -------- */
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
        state.approvalURL = null; // ✅ STOP PAYPAL REDIRECT LOOP
        state.orderId = null;
      })
      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;
      }).addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      }).addCase(getAllOrdersByUserId.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderList=action.payload.data;
      }).addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList=[];
      }).addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      }).addCase(getOrderDetails.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderDetails=action.payload.data;
      }).addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails=null;
      })
  },
});

/* =========================
   EXPORTS
========================= */
export const {resetOrderDetails}=shoppingOrderSlice.actions;
export const { resetOrderState } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import axios from "axios";

const initialState = {
  data: {},
  recipient: {},
  price: 0,
  currency: "",
  status: "",
  error: "",
  loadingFlag: false,
};

export const fetchCheckDelivery = createAsyncThunk(
  "delivery/fetchDelivery",
  async ({ token, type }, { getState, rejectWithValue }) => {
    const { selectedBoxes } = getState().subscribesStore;
    const { recipient } = getState().deliveryStore;

    try {
      const boxes = selectedBoxes.map((box) => ({
        name: box.name,
        cost: box.variants[box.selected].cost,
        weight: box.variants[box.selected].weight,
      }));

      const response = await axios.post(
        `${API_URL}check_delivery`,
        {
          ...type,
          recipient,
          boxes,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {...response.data};
    } catch (error) {
      console.log("delivery", error);
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

const subscribeSlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setAddress(state, action) {
      state.recipient = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCheckDelivery.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCheckDelivery.fulfilled, (state, action) => {
        state.status = "idle";
        const { price, currency } = action.payload;
        if(price) {
          state.price = price;
          state.currency = currency;
        }
      })
      .addCase(fetchCheckDelivery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setAddress,
} = subscribeSlice.actions;

export default subscribeSlice.reducer;

export const getBoxes = (state) => state.subscribes.selectedBoxes;

export const getStatus = (state) => state.subscribes.status;

export const getSubscribe = (state) => state.subscribes.newSubscribe;

export const getSubscribesList = (state) => state.subscribes.activeSubscribes;

export const getErrors = (state) => state.subscribes.error;

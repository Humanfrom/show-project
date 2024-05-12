import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import axios from "axios";

const initialState = {
  activeSubscribes: [],
  newSubscribe: {},
  selectedBoxes: [],
  status: "",
  error: "",
  loadingFlag: false,
};

export const fetchSubs = createAsyncThunk(
  "subscribes/fetchSubs",
  async ({ token, guid }, { getState }) => {
    const state = getState().subscribes;

    const response = await axios.get(`${API_URL}get_subscribes`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: token,
      },
      params: {
        name: state.name,
      },
    });

    return [...response.data];
  }
);

export const fetchCreateSub = createAsyncThunk(
  "subscribes/fetchCreateSub",
  async ({ token, data }, { getState }) => {
    //const state = getState().subscribes;

    const response = await axios.post(
      `${API_URL}create_subscribe`,
      { data },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return [...response.data];
  }
);

const subscribeSlice = createSlice({
  name: "subscribes",
  initialState,
  reducers: {
    addBox(state, action) {
      state.selectedBoxes = [...state.selectedBoxes, action.payload];
    },
    removeBoxes(state, action) {
      state.selectedBoxes = state.selectedBoxes.filter(
        (box) => box._id !== action.payload._id
      );
    },
    removeOneBox(state, action) {
      let remove = true;
      state.selectedBoxes = state.selectedBoxes = state.selectedBoxes.filter(
        (box) => {
          if (remove && box._id === action.payload._id) {
            return (remove = false);
          }
          return true;
        }
      );
    },
    setManyBoxes(state, action) {
      const clearBoxes = state.selectedBoxes.filter(
        (box) => box._id !== action.payload.box._id
      );
      const pushBoxes = new Array(action.payload.count).fill({
        ...action.payload.box,
      });
      state.selectedBoxes = [...clearBoxes, ...pushBoxes];
    },
    setSubscribe(state, action) {
      state.newSubscribe = action.payload;
    },
    removeSubscribe(state, action) {
      state.activeSubscribes = state.activeSubscribes.filter(
        (sub) => sub.id != action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSubs.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSubs.fulfilled, (state, action) => {
        state.status = "idle";
        state.activeSubscribes = action.payload;
      })
      .addCase(fetchSubs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addBox,
  removeOneBox,
  removeBoxes,
  setManyBoxes,
  setSubscribe,
  removeSubscribe,
} = subscribeSlice.actions;

export default subscribeSlice.reducer;

export const getBoxes = (state) => state.subscribes.selectedBoxes;

export const getStatus = (state) => state.subscribes.status;

export const getSubscribe = (state) => state.subscribes.newSubscribe;

export const getSubscribesList = (state) => state.subscribes.activeSubscribes;

export const getErrors = (state) => state.subscribes.error;

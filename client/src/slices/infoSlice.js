import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import axios from "axios";
import userSlice from "./userSlice";

const initialState = {
  currentData: {
    name: 'test',
    data: [
        {
            header: 'Как оформить подписку',
            description: 'Короткое описание процесса оформления.',
            text: 'Оформить подписку очень просто. Надо просто выбрать набор, а также вариацию интересующего набора. Потом перейти в корзину и указать адрес, а также контактные данные. Потом оплатить и ждать чай.'
        },
        {
            header: 'Как заварить чай',
            description: 'Короткое описание процесса заваривания чая.',
            text: 'Надо взять чайник. Взять воду, вскепетить её. Залить воду в чайник с чаем. Разлить по кружкам и пить. Наслаждаясь вкусом и ароматом.'
        },
    ]
  },
  status: "",
  error: "",
};

export const fetchInfo = createAsyncThunk(
  "info/fetchInfo",
  async ({ token, name }, { getState }) => {
    const state = getState();

    const response = await axios.get(`${API_URL}get_info`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      params: { name },
    });

    return [...response.data];
  }
);

const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setInfo(state, action) {
      state.currentData = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInfo.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentData = action.payload;
      })
      .addCase(fetchInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setInfo } = infoSlice.actions;

export default infoSlice.reducer;

export const getStatus = (state) => state.info.status;

export const getInfo = (state) => state.info.currentBox;

export const getErrors = (state) => state.info.error;

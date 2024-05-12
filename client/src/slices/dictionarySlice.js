import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import axios from "axios";

const initialState = {
  data: {
    classes: {
      white: "Белый",
      green: "Зелёный",
      yellow: "Жёлтый",
      wulong: "Улун",
      red: "Красный",
      black: "Чёрный",
      puer: "Пуэр",
    },
    weights: {
      small: "SMALL",
      med: "MEDIUM",
      big: "LARGE",
    },
    promos: {
      sale: "Распродажа",
      spring: "Весна",
      double: "Два по цене одного",
    },
    levels: [
      "Обычный",
      "Необычный",
      "Редкий",
      "Эпический",
      "Легендарный",
      "Мифический",
    ],
    payments: [
      {
        name: "cryptopay",
        title: "Telegram Payment",
        currency: ["USDT", "TON"],
        fixsale: 500,
        comment: "Перевод криптовалюты по актуальному курсу ТГ"
      },
      {
        name: "paymentrub",
        title: "Russian Test Payment",
        currency: ["RUB"],
        fixsale: 0,
        comment: "К оплате принимаются только карты МИР"
      },
    ],
    periods: [
      { title: 1, sale: 0.5 },
      { title: 2, sale: 1 },
      { title: 3, sale: 1.5 },
      { title: 4, sale: 2 },
      { title: 5, sale: 2.5 },
      { title: 6, sale: 3 },
      { title: 7, sale: 3.5 },
      { title: 8, sale: 4 },
      { title: 9, sale: 4.5 },
      { title: 10, sale: 5 },
      { title: 11, sale: 5.5 },
      { title: 12, sale: 6 },
    ],
    deliveryTypes: [
      { title: 'Яндекс - до двери', type: 'courier', service: 'yandex' },
      { title: 'Яндекс - самовывоз из ПВЗ', type: 'pvz', service: 'yandex' },
      { title: 'Почта - до двери', type: 'courier', service: 'russianpost' },
      { title: 'Почта - самовывоз из ПВЗ', type: 'pvz', service: 'russianpost' },
    ]
  },
  status: "",
  error: "",
};

export const fetchInfo = createAsyncThunk(
  "info/fetchInfo",
  async ({ token }, { getState }) => {
    const state = getState();

    const response = await axios.get(`${API_URL}get_info`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: token,
      },
      /*params: {
            name: state.name
          }*/
    });

    return [...response.data];
  }
);

const dictionarySlice = createSlice({
  name: "dictionaries",
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

export const { setInfo } = dictionarySlice.actions;

export default dictionarySlice.reducer;

export const getStatus = (state) => state.info.status;

export const getInfo = (state) => state.info.currentBox;

export const getErrors = (state) => state.info.error;

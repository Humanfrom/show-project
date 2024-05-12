import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, AUTH_URL } from "../constants";
import axios from "axios";

const initialState = {
  userData: {
    delivery: [],
  },
  status: "",
  error: "",
  loadingFlag: false,
  userStatus: "guest",
  message: "",
  confirm: "",
};

export const auth = createAsyncThunk(
  "user/auth",
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${AUTH_URL}login`,
        {},
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Basic ${btoa(`${login}:${password}`)}`,
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const registration = createAsyncThunk(
  "user/registration",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${AUTH_URL}registration`,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const recover = createAsyncThunk(
  "user/recover",
  async ({ login }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${AUTH_URL}recover`,
        { login },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          params: {
            type: "recover",
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const checkRef = createAsyncThunk(
  "user/checkRef",
  async ({ type, ref }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${AUTH_URL}recover`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        params: {
          type,
          ref,
        },
      });

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const reset = createAsyncThunk(
  "user/reset",
  async ({ password }, { rejectWithValue, getState }) => {
    const { confirm } = getState().userStore;
    try {
      const response = await axios.put(
        `${AUTH_URL}recover`,
        { hash: confirm, password },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          params: {
            type: "reset",
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${AUTH_URL}get_user`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      });

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ token }, { rejectWithValue, getState }) => {
    const { userData } = getState().userStore;
    try {
      const response = await axios.put(
        `${AUTH_URL}update_user`,
        { ...userData },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

export const fetchAddRecipient = createAsyncThunk(
  "user/fetchAddRecipient",
  async ({ recipient, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${AUTH_URL}add_recipient`,
        { recipient },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { ...response.data };
    } catch (error) {
      const message = error?.response.data.error || String(error);
      return rejectWithValue({ data: {}, error: message });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser() {
      localStorage.removeItem("token");
      return initialState;
    },
    setUser(state, action) {
      state.userData = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addAddress(state, action) {
      state.userData.delivery = state.userData.delivery
        ? [...state.userData.delivery, action.payload]
        : [action.payload];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(auth.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(auth.fulfilled, (state, action) => {
        state.status = "idle";
        if (!action.payload?.error) {
          const { user, token } = action.payload;
          state.userStatus = user.status;
          state.userData = { ...state.userData, ...user };
          localStorage.setItem("token", JSON.stringify(token));
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(auth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(registration.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.status = "idle";
        if (!action.payload?.error) {
          state.userStatus = "registred";
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(registration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(recover.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(recover.fulfilled, (state, action) => {
        state.status = "idle";
        if (!action.payload?.error) {
          state.userStatus = "recover";
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(recover.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(reset.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(reset.fulfilled, (state, action) => {
        state.status = "idle";
        if (!action.payload?.error) {
          state.userStatus = "reset";
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(reset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(checkRef.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(checkRef.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload?.confirm) {
          state.confirm = action.payload.confirm;
        } else {
          state.error = action.payload.error || "Ошибка проверки ссылки";
        }
      })
      .addCase(checkRef.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(fetchUserData.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "idle";
        state.userData = action.payload?.delivery
          ? {
              ...action.payload,
              delivery: [
                ...action.payload.delivery,
                ...state.userData.delivery,
              ],
            }
          : { ...action.payload, delivery: state.userData.delivery };
        if (!action.payload?.error) {
          state.userStatus = action.payload.status;
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "idle";
        state.userStatus = "guest";
      })
      .addCase(fetchAddRecipient.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAddRecipient.fulfilled, (state, action) => {
        state.status = "idle";
        if (!action.payload?.error) {
          state.userData.delivery = action.payload;
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(fetchAddRecipient.rejected, (state, action) => {
        state.status = "idle";
        state.userStatus = "guest";
      });
  },
});

export const { setUser, setError, clearUser, addAddress } = userSlice.actions;

export default userSlice.reducer;

export const getUserData = (state) => state.user.userData;

export const getStatus = (state) => state.user.status;

export const getErrors = (state) => state.user.error;

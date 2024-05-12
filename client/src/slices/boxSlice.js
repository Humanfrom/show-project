import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import axios from "axios";
import { filterBoxByMask, matchArrays } from "../utils";

const initialState = {
  boxesList: [],
  currentBox: {},
  status: "",
  error: "",
  extendedFilter: null,
};

export const fetchBoxes = createAsyncThunk(
  "boxes/fetchBoxes",
  async (props, { getState }) => {
    const { boxesStore, userStore } = getState();

    try {
      const response = await axios.get(`${API_URL}get_boxes`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      const userData = userStore.userData?.grade
        ? userStore.userData
        : { grade: 0, achievements: [] };

      const boxes = [...response.data].map((box) => {
        const access =
          userData.grade + 3 > box.level &&
          (!box.achievements.length ||
            box.achievements.every((value) =>
              userData.achievements.includes(value)
            ));

        return { ...box, access };
      });

      if (boxesStore.extendedFilter) {
        return filterBoxByMask(boxes, boxesStore.extendedFilter);
      } else {
        return boxes;
      }
    } catch (error) {}
  }
);

export const fetchBox = createAsyncThunk(
  "boxes/fetchBox",
  async ({ name }, { getState }) => {
    const { currentBox, boxesList } = getState().boxesStore;

    console.log("name", name);
    if (currentBox.name && currentBox.name === name) {
      return { ...currentBox };
    } else {
      const [preloadBox] = boxesList.filter((box) => box.name === name) || [];
      setBox(boxesList.filter((box) => box.name === name));
    }

    try {
      const response = await axios.get(`${API_URL}get_box`, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        params: {
          name,
        },
      });

      const [ selected ] = Object.keys(response.data.variants);
      return { ...response.data, selected };
      
    } catch (error) {
      console.log(error);
    }
  }
);

const boxSlice = createSlice({
  name: "boxes",
  initialState,
  reducers: {
    setBox(state, action) {
      state.currentBox = action.payload;
    },
    setBoxFilter(state, action) {
      state.extendedFilter = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBoxes.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBoxes.fulfilled, (state, action) => {
        state.status = "idle";
        state.boxesList = action.payload;
      })
      .addCase(fetchBoxes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBox.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBox.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentBox = action.payload;
      })
      .addCase(fetchBox.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setBox, setBoxFilter } = boxSlice.actions;

export default boxSlice.reducer;

export const getBoxes = (state) => state.boxes.selectedBoxes;

export const getStatus = (state) => state.boxes.status;

export const getBox = (state) => state.boxes.currentBox;

export const getSubscribesList = (state) => state.boxes.boxesList;

export const getErrors = (state) => state.boxes.error;

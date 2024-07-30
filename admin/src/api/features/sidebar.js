import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  sb: false,
};

export const sbSlice = createSlice({
  name: "sb",
  initialState,
  reducers: {
    changeSb: (state) => {
      state.sb = !state.sb;
    },
    changeBs: (state) => {
      state.sb = false;
    },
  },
});

export const { changeSb, changeBs } = sbSlice.actions;
const persistConfig = {
  key: "sb",
  storage,
};

export default persistReducer(persistConfig, sbSlice.reducer);

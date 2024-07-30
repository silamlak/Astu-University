import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  theme: "light",
};

export const themeSlice = createSlice({
  name: "th",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { changeTheme } = themeSlice.actions;
const persistConfig = {
  key: "th",
  storage,
};

export default persistReducer(persistConfig, themeSlice.reducer);

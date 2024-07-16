import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  applications: null,
};

export const applicationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addApplication: (state, action) => {
      state.applications = action.payload;
    },
    removeApplication: (state) => {
      state.applications = null;
    },
    updateState: (state, action) => {
      state.applications = state.applications.map((app) => {
        console.log(action.payload)
        if (app._id === action.payload.id) {
          if (action.payload.role_based === 'College') {
            console.log('object')
            return {
              ...app,
              college_status: action.payload.status,
            }
          } else if (action.payload.role === "Department") {
            console.log("object");

            return {
              ...app,
              department_status: action.payload.status,
            };
          }
        }
        return app;
      });
    },
  },
});

export const { addApplication, removeApplication, updateState } =
  applicationSlice.actions;
const persistConfig = {
  key: "application",
  storage,
};

export default persistReducer(persistConfig, applicationSlice.reducer);

import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  student: null,
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.student = action.payload;
    },
    removeStudent: (state) => {
      state.student = null;
    },
    updateStateStudent: (state, action) => {
      state.student = state.student.map((app) => {
        console.log(action.payload);
        if (app._id === action.payload.id) {
          if (action.payload.role_based === "College") {
            console.log("object");
            return {
              ...app,
              college_status: action.payload.status,
            };
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

export const { addStudent, removeStudent, updateStateStudent } = studentSlice.actions;
const persistConfig = {
  key: "student",
  storage,
};

export default persistReducer(persistConfig, studentSlice.reducer);

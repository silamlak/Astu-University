import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./features/auth";
import applicationReducer from "./features/applicationList";
import studentReducer from "./features/studentList";
import themeSlice from "./features/themeSlice";
import sidebar from "./features/sidebar";

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine the reducers
const rootReducer = combineReducers({
  auth: authReducer,
  application: applicationReducer,
  student: studentReducer,
  theme: themeSlice,
  sb: sidebar,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);

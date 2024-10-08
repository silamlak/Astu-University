import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import themeReducer from "./features/themeSlice"
import authReducer from './features/authSlice'

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine the reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);

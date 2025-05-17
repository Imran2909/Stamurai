// src/app/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import rootReducer from './reducer';

// Config for redux-persist — only persist the user slice (like auth token, username)
const persistConfig = {
  key: 'root',        // The key for persisted data in storage
  storage,            // Storage engine (localStorage here)
  whitelist: ['user'], // Only persist the user slice to keep auth info
};

// Create a persisted reducer based on rootReducer & persist config
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with persisted reducer and middleware tweaks
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check to avoid redux-persist warnings
    }),
});

// Create a persistor to control persistence (used in app entry point)
export const persistor = persistStore(store);

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 

// Define the type for the store's state
export const MyStore = configureStore({
  reducer: {
    users: userReducer, 
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof MyStore.getState>;
export type AppDispatch = typeof MyStore.dispatch;

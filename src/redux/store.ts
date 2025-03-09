// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import domReducer from './slices/domSlice.ts';

export const store = configureStore({
  reducer: {
    dom: domReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
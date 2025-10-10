import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from '../features/BookingSlice';
import uiReducer from '../features/uiSlice';
import driversReducer from '../features/DriversSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    ui: uiReducer,
    drivers: driversReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

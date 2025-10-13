import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';


import bookingsReducer from '../features/BookingSlice';
import uiReducer from '../features/uiSlice';
import driversReducer from '../features/DriversSlice';
import carsReducer from '../features/CarsSlice';
import clientsReducer from '../features/ClientsSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    ui: uiReducer,
    drivers: driversReducer,
    cars: carsReducer,
    clients: clientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fleetReducer from './slices/fleetSlice';
import driverReducer from './slices/driverSlice';
import tripReducer from './slices/tripSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fleet: fleetReducer,
    driver: driverReducer,
    trip: tripReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

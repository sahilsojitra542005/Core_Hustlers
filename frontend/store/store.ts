import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fleetReducer from './slices/fleetSlice';
import driverReducer from './slices/driverSlice';
import tripReducer from './slices/tripSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import expenseReducer from './slices/expenseSlice';
import settingsReducer from './slices/settingsSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fleet: fleetReducer,
    driver: driverReducer,
    trip: tripReducer,
    maintenance: maintenanceReducer,
    expense: expenseReducer,
    settings: settingsReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Driver {
  _id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  tripCompletionRate: number;
  status: 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
}

interface DriverState {
  drivers: Driver[];
  eligibleDrivers: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  eligibleDrivers: [],
  loading: false,
  error: null,
};

export const fetchDrivers = createAsyncThunk(
  'driver/fetchDrivers',
  async (params?: { status?: string; search?: string }) => {
    const response = await api.get('/api/drivers', { params });
    return response.data as Driver[];
  }
);

export const fetchEligibleDrivers = createAsyncThunk(
  'driver/fetchEligibleDrivers',
  async () => {
    const response = await api.get('/api/drivers/dispatch-selection');
    return response.data as Driver[];
  }
);

export const createDriver = createAsyncThunk(
  'driver/createDriver',
  async (driverData: Partial<Driver>) => {
    const response = await api.post('/api/drivers', driverData);
    return response.data as Driver;
  }
);

export const updateDriver = createAsyncThunk(
  'driver/updateDriver',
  async ({ id, data }: { id: string; data: Partial<Driver> }) => {
    const response = await api.put(`/api/drivers/${id}`, data);
    return response.data as Driver;
  }
);

export const deleteDriver = createAsyncThunk(
  'driver/deleteDriver',
  async (id: string) => {
    await api.delete(`/api/drivers/${id}`);
    return id;
  }
);

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchDrivers
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch drivers';
      })
      // fetchEligibleDrivers
      .addCase(fetchEligibleDrivers.fulfilled, (state, action) => {
        state.eligibleDrivers = action.payload;
      })
      // createDriver
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })
      // updateDriver
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
      })
      // deleteDriver
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter(d => d._id !== action.payload);
      });
  },
});

export default driverSlice.reducer;

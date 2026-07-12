import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Vehicle {
  _id: string;
  regNumber: string;
  modelName: string;
  type: string;
  capacity: number;
  odometer: number;
  acquisitionCost: number;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  region?: string;
  createdAt: string;
  updatedAt: string;
}

interface FleetState {
  vehicles: Vehicle[];
  eligibleVehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  vehicles: [],
  eligibleVehicles: [],
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk(
  'fleet/fetchVehicles',
  async (params?: { type?: string; status?: string; region?: string; search?: string }) => {
    const response = await api.get('/api/vehicles', { params });
    return response.data as Vehicle[];
  }
);

export const fetchEligibleVehicles = createAsyncThunk(
  'fleet/fetchEligibleVehicles',
  async () => {
    const response = await api.get('/api/vehicles/dispatch-selection');
    return response.data as Vehicle[];
  }
);

export const createVehicle = createAsyncThunk(
  'fleet/createVehicle',
  async (vehicleData: Partial<Vehicle>) => {
    const response = await api.post('/api/vehicles', vehicleData);
    return response.data as Vehicle;
  }
);

export const updateVehicle = createAsyncThunk(
  'fleet/updateVehicle',
  async ({ id, data }: { id: string; data: Partial<Vehicle> }) => {
    const response = await api.put(`/api/vehicles/${id}`, data);
    return response.data as Vehicle;
  }
);

export const deleteVehicle = createAsyncThunk(
  'fleet/deleteVehicle',
  async (id: string) => {
    await api.delete(`/api/vehicles/${id}`);
    return id;
  }
);

export const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchVehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vehicles';
      })
      // fetchEligibleVehicles
      .addCase(fetchEligibleVehicles.fulfilled, (state, action) => {
        state.eligibleVehicles = action.payload;
      })
      // createVehicle
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      // updateVehicle
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      // deleteVehicle
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
      });
  },
});

export default fleetSlice.reducer;

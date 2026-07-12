import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface MaintenanceRecord {
  _id: string;
  vehicle: {
    _id: string;
    regNumber: string;
    modelName: string;
  };
  maintenanceType: string;
  cost: number;
  status: 'Active' | 'Closed' | 'In Shop' | 'Available';
  startDate: string;
  endDate?: string;
  description?: string;
}

interface MaintenanceState {
  records: MaintenanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  records: [],
  loading: false,
  error: null,
};

export const fetchMaintenanceLogs = createAsyncThunk(
  'maintenance/fetchMaintenanceLogs',
  async () => {
    const response = await api.get('/api/maintenance');
    return response.data as MaintenanceRecord[];
  }
);

export const logMaintenance = createAsyncThunk(
  'maintenance/logMaintenance',
  async (data: Partial<MaintenanceRecord> & { vehicleId: string }) => {
    const response = await api.post('/api/maintenance', data);
    return response.data as MaintenanceRecord;
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenance/updateMaintenance',
  async ({ id, data }: { id: string; data: Partial<MaintenanceRecord> }) => {
    const response = await api.put(`/api/maintenance/${id}`, data);
    return response.data as MaintenanceRecord;
  }
);

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMaintenanceLogs
      .addCase(fetchMaintenanceLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMaintenanceLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch maintenance logs';
      })
      // logMaintenance
      .addCase(logMaintenance.fulfilled, (state, action) => {
        state.records.push(action.payload);
      })
      // updateMaintenance
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export default maintenanceSlice.reducer;

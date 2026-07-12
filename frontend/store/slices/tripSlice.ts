import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Trip {
  _id: string;
  tripId: string;
  source: string;
  destination: string;
  vehicle?: {
    _id: string;
    regNumber: string;
    modelName: string;
  };
  driver?: {
    _id: string;
    name: string;
  };
  cargoWeight: number;
  plannedDistance: number;
  status: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
  startOdometer?: number;
  createdAt: string;
}

interface TripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  loading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk(
  'trip/fetchTrips',
  async (params?: { status?: string; search?: string }) => {
    const response = await api.get('/api/trips', { params });
    return response.data as Trip[];
  }
);

export const createDraftTrip = createAsyncThunk(
  'trip/createDraftTrip',
  async (tripData: Partial<Trip>) => {
    const response = await api.post('/api/trips', tripData);
    return response.data as Trip;
  }
);

export const dispatchTrip = createAsyncThunk(
  'trip/dispatchTrip',
  async ({ id, data }: { id: string; data?: { vehicleId?: string; driverId?: string } }) => {
    const response = await api.put(`/api/trips/${id}/dispatch`, data || {});
    return response.data as Trip;
  }
);

export const completeTrip = createAsyncThunk(
  'trip/completeTrip',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await api.put(`/api/trips/${id}/complete`, data);
    return response.data as Trip;
  }
);

export const cancelTrip = createAsyncThunk(
  'trip/cancelTrip',
  async (id: string) => {
    const response = await api.put(`/api/trips/${id}/cancel`);
    return response.data as Trip;
  }
);

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTrips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // createDraftTrip
      .addCase(createDraftTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      // dispatchTrip, completeTrip, cancelTrip updates
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && ['trip/dispatchTrip', 'trip/completeTrip', 'trip/cancelTrip'].includes(action.type.replace('/fulfilled', '')),
        (state, action: PayloadAction<Trip>) => {
          const index = state.trips.findIndex(t => t._id === action.payload._id);
          if (index !== -1) {
            state.trips[index] = action.payload;
          }
        }
      );
  },
});

export default tripSlice.reducer;

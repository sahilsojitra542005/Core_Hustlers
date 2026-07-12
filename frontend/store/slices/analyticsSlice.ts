import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Trip } from './tripSlice';
import { Vehicle } from './fleetSlice';

export interface DashboardData {
  kpis: {
    activeVehicles: number;
    availableVehicles: number;
    vehiclesInMaintenance: number;
    activeTrips: number;
    pendingTrips: number;
    driversOnDuty: number;
    fleetUtilization: number;
  };
  recentTrips: Trip[];
  statusBreakdown: {
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
  };
}

export interface ReportsData {
  kpis: {
    fuelEfficiency: number;
    fleetUtilization: number;
    operationalCost: number;
    vehicleRoi: number;
  };
  monthlyRevenue: number[];
  topCostliestVehicles: {
    _id: string;
    modelName: string;
    regNumber: string;
    totalCost: number;
  }[];
}

interface AnalyticsState {
  dashboard: DashboardData | null;
  reports: ReportsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboard: null,
  reports: null,
  loading: false,
  error: null,
};

export const fetchDashboardAnalytics = createAsyncThunk(
  'analytics/fetchDashboardAnalytics',
  async (params?: { vehicleType?: string; region?: string }) => {
    const response = await api.get('/api/analytics/dashboard', { params });
    return response.data as DashboardData;
  }
);

export const fetchReportsAnalytics = createAsyncThunk(
  'analytics/fetchReportsAnalytics',
  async () => {
    const response = await api.get('/api/analytics/reports');
    return response.data as ReportsData;
  }
);

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      })
      // Reports
      .addCase(fetchReportsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReportsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports data';
      });
  },
});

export default analyticsSlice.reducer;

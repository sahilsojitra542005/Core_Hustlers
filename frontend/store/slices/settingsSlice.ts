import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Settings {
  _id: string;
  depotName: string;
  currency: string;
  distanceUnit: string;
  routeRoles?: Record<string, string[]>;
}

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    const response = await api.get('/api/settings');
    return response.data as Settings;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (data: Partial<Settings>) => {
    const response = await api.put('/api/settings', data);
    return response.data as Settings;
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      })
      // updateSettings
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export default settingsSlice.reducer;

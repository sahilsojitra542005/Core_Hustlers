import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface FuelLog {
  _id: string;
  vehicle: {
    _id: string;
    regNumber: string;
  };
  date: string;
  liters: number;
  cost: number;
}

export interface OtherExpense {
  _id: string;
  trip?: {
    _id: string;
    tripId: string;
  };
  vehicle: {
    _id: string;
    regNumber: string;
  };
  toll: number;
  other: number;
  date: string;
  description?: string;
  maintLinked?: number;
  total?: number;
  status?: string; // UI mostly needs status, we might synthesize it or get it from API
}

export interface ExpenseSummary {
  fuelTotal: number;
  tollTotal: number;
  otherTotal: number;
  maintTotal: number;
  grandTotal: number;
}

interface ExpenseState {
  fuelLogs: FuelLog[];
  otherExpenses: OtherExpense[];
  summary: ExpenseSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  fuelLogs: [],
  otherExpenses: [],
  summary: null,
  loading: false,
  error: null,
};

export const fetchFuelLogs = createAsyncThunk(
  'expense/fetchFuelLogs',
  async () => {
    const response = await api.get('/api/expenses/fuel');
    return response.data as FuelLog[];
  }
);

export const logFuel = createAsyncThunk(
  'expense/logFuel',
  async (data: { vehicleId: string; liters: number; cost: number; date: string }) => {
    const response = await api.post('/api/expenses/fuel', data);
    return response.data as FuelLog;
  }
);

export const fetchOtherExpenses = createAsyncThunk(
  'expense/fetchOtherExpenses',
  async () => {
    const response = await api.get('/api/expenses/other');
    return response.data as OtherExpense[];
  }
);

export const logExpense = createAsyncThunk(
  'expense/logExpense',
  async (data: { vehicleId: string; tripId?: string; toll: number; other: number; date: string; description?: string }) => {
    const response = await api.post('/api/expenses/other', data);
    return response.data as OtherExpense;
  }
);

export const fetchExpenseSummary = createAsyncThunk(
  'expense/fetchExpenseSummary',
  async () => {
    const response = await api.get('/api/expenses/summary');
    return response.data as ExpenseSummary;
  }
);

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFuelLogs
      .addCase(fetchFuelLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuelLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs = action.payload;
      })
      .addCase(fetchFuelLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch fuel logs';
      })
      // fetchOtherExpenses
      .addCase(fetchOtherExpenses.fulfilled, (state, action) => {
        state.otherExpenses = action.payload;
      })
      // fetchExpenseSummary
      .addCase(fetchExpenseSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // logFuel
      .addCase(logFuel.fulfilled, (state, action) => {
        state.fuelLogs.push(action.payload);
      })
      // logExpense
      .addCase(logExpense.fulfilled, (state, action) => {
        state.otherExpenses.push(action.payload);
      });
  },
});

export default expenseSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    email: string;
    role: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    email: 'raven.k@transitops.in',
    role: 'Dispatcher',
    name: 'Raven K.',
  },
  isAuthenticated: true, // Mocked as true for UI purpose
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; role: string; name: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

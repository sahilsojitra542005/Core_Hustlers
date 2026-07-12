import { createSlice } from '@reduxjs/toolkit';

export interface Driver {
  name: string;
  licenseNo: string;
  category: string;
  expiry: string;
  contact: string;
  tripCompl: string;
  safety: 'Available' | 'Suspended' | 'On Trip';
  status: 'Available' | 'Suspended' | 'On Trip' | 'Off Duty';
}

interface DriverState {
  drivers: Driver[];
}

const initialState: DriverState = {
  drivers: [
    { name: 'Alex', licenseNo: 'DL-88213', category: 'LMV', expiry: '12/2028', contact: '98765xxxx', tripCompl: '96%', safety: 'Available', status: 'Available' },
    { name: 'John', licenseNo: 'DL-44120', category: 'HMV', expiry: '03/2025 EXPIRE', contact: '98220xxxx', tripCompl: '81%', safety: 'Suspended', status: 'Suspended' },
    { name: 'Priya', licenseNo: 'DL-77031', category: 'LMV', expiry: '08/2028', contact: '99110xxxx', tripCompl: '99%', safety: 'On Trip', status: 'On Trip' },
    { name: 'Suresh', licenseNo: 'DL-90045', category: 'HMV', expiry: '01/2027', contact: '97440xxxx', tripCompl: '88%', safety: 'Available', status: 'Off Duty' },
  ],
};

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {},
});

export default driverSlice.reducer;

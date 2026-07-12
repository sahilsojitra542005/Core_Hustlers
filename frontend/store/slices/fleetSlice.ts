import { createSlice } from '@reduxjs/toolkit';

export interface Vehicle {
  regNo: string;
  name: string;
  type: string;
  capacity: string;
  odometer: string;
  acqCost: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
}

interface FleetState {
  vehicles: Vehicle[];
}

const initialState: FleetState = {
  vehicles: [
    { regNo: 'GJ01AB452', name: 'VAN-05', type: 'Van', capacity: '500 kg', odometer: '74,000', acqCost: '6,20,000', status: 'Available' },
    { regNo: 'GJ01AB998', name: 'TRUCK-11', type: 'Truck', capacity: '5 Ton', odometer: '182,000', acqCost: '24,50,000', status: 'On Trip' },
    { regNo: 'GJ01AB1120', name: 'MINI-03', type: 'Mini', capacity: '1 Ton', odometer: '66,000', acqCost: '4,10,000', status: 'In Shop' },
    { regNo: 'GJ01AB008', name: 'VAN-09', type: 'Van', capacity: '750 kg', odometer: '241,900', acqCost: '5,90,000', status: 'Retired' },
  ],
};

export const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {},
});

export default fleetSlice.reducer;

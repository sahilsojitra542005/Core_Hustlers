import { createSlice } from '@reduxjs/toolkit';

export interface Trip {
  id: string;
  vehicle: string;
  driver: string;
  status: 'Draft' | 'Dispatched' | 'On Trip' | 'Completed' | 'Cancelled';
  eta: string;
  source?: string;
  destination?: string;
}

interface TripState {
  recentTrips: Trip[];
  liveTrips: Trip[];
}

const initialState: TripState = {
  recentTrips: [
    { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
    { id: 'TR002', vehicle: 'TRX-12', driver: 'John', status: 'Completed', eta: '-' },
    { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
    { id: 'TR004', vehicle: '-', driver: '-', status: 'Draft', eta: 'Awaiting vehicle' },
  ],
  liveTrips: [
    { id: 'TR001', source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', vehicle: 'VAN-05', driver: 'ALEX', status: 'Dispatched', eta: '45 min' },
    { id: 'TR004', source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', vehicle: 'TRUCK-04', driver: 'SURESH', status: 'Draft', eta: 'Awaiting driver' },
    { id: 'TR006', source: 'Mansa', destination: 'Kalol Depot', vehicle: 'Unassigned', driver: '', status: 'Cancelled', eta: 'Vehicle went to shop' },
  ]
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {},
});

export default tripSlice.reducer;

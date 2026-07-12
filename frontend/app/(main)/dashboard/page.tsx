"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchDashboardAnalytics } from "@/store/slices/analyticsSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { dashboard, loading } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  const kpis = dashboard?.kpis;
  const recentTrips = dashboard?.recentTrips || [];
  const status = dashboard?.statusBreakdown;

  const stats = [
    { label: "ACTIVE VEHICLES", value: kpis?.activeVehicles || 0, color: "border-l-blue-500" },
    { label: "AVAILABLE VEHICLES", value: kpis?.availableVehicles || 0, color: "border-l-green-500" },
    { label: "VEHICLES IN MAINTENANCE", value: kpis?.vehiclesInMaintenance || 0, color: "border-l-orange-500" },
    { label: "ACTIVE TRIPS", value: kpis?.activeTrips || 0, color: "border-l-blue-500" },
    { label: "PENDING TRIPS", value: kpis?.pendingTrips || 0, color: "border-l-gray-400" },
    { label: "DRIVERS ON DUTY", value: kpis?.driversOnDuty || 0, color: "border-l-gray-400" },
    { label: "FLEET UTILIZATION", value: `${kpis?.fleetUtilization || 0}%`, color: "border-l-green-500" },
  ];

  // Helper to calculate percentage for status bars
  const totalVehicles = status ? (status.available + status.onTrip + status.inShop + status.retired) : 1;
  const getPct = (val = 0) => `${Math.round((val / (totalVehicles || 1)) * 100)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Filters</span>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] h-9 bg-transparent border-border">
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vehicle Type: All</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] h-9 bg-transparent border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] h-9 bg-transparent border-border">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Region: All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className={`bg-transparent border-border rounded-lg border-l-4 ${stat.color}`}>
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <span className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2">{stat.label}</span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">RECENT TRIPS</h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">TRIP</th>
                      <th className="px-4 py-3 font-medium">VEHICLE</th>
                      <th className="px-4 py-3 font-medium">DRIVER</th>
                      <th className="px-4 py-3 font-medium">STATUS</th>
                      <th className="px-4 py-3 font-medium">DISTANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTrips.map((trip, i) => (
                      <tr key={i} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3">{trip.tripId}</td>
                        <td className="px-4 py-3">{trip.vehicle?.regNumber || '-'}</td>
                        <td className="px-4 py-3">{trip.driver?.name || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium text-black ${
                            trip.status === 'On Trip' ? 'bg-blue-400' :
                            trip.status === 'Completed' ? 'bg-green-500' :
                            trip.status === 'Dispatched' ? 'bg-blue-400' : 'bg-gray-400'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{trip.plannedDistance} km</td>
                      </tr>
                    ))}
                    {recentTrips.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          No recent trips found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">VEHICLE STATUS</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">Available</div>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: getPct(status?.available) }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-8 text-right">{status?.available || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">On Trip</div>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: getPct(status?.onTrip) }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-8 text-right">{status?.onTrip || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">In Shop</div>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: getPct(status?.inShop) }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-8 text-right">{status?.inShop || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">Retired</div>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 transition-all duration-500" style={{ width: getPct(status?.retired) }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-8 text-right">{status?.retired || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

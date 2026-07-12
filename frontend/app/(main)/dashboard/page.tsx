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
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase w-full sm:w-auto">Filters</span>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] h-9 bg-card border-border/50">
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vehicle Type: All</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] h-9 bg-card border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] h-9 bg-card border-border/50">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Region: All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground animate-pulse p-4 rounded-lg bg-card/50 border border-border/50">Loading dashboard metrics...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className={`bg-card/50 backdrop-blur-sm border-border/50 rounded-xl border-l-4 ${stat.color} shadow-sm hover:shadow-md transition-shadow`}>
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <span className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2 leading-tight">{stat.label}</span>
                  <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">{stat.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">RECENT TRIPS</h3>
              <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold">TRIP</th>
                        <th className="px-4 py-3 font-semibold">VEHICLE</th>
                        <th className="px-4 py-3 font-semibold">DRIVER</th>
                        <th className="px-4 py-3 font-semibold">STATUS</th>
                        <th className="px-4 py-3 font-semibold">DISTANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentTrips.map((trip, i) => (
                        <tr key={i} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs">{trip.tripId}</td>
                          <td className="px-4 py-3">{trip.vehicle?.regNumber || '-'}</td>
                          <td className="px-4 py-3">{trip.driver?.name || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider ${
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
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                            No recent trips found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">VEHICLE STATUS</h3>
              <div className="p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">Available</div>
                  <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: getPct(status?.available) }}></div>
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{status?.available || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">On Trip</div>
                  <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 transition-all duration-500 shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: getPct(status?.onTrip) }}></div>
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{status?.onTrip || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">In Shop</div>
                  <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: getPct(status?.inShop) }}></div>
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{status?.inShop || 0}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">Retired</div>
                  <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 transition-all duration-500 shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: getPct(status?.retired) }}></div>
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{status?.retired || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const { vehicles } = useAppSelector((state) => state.fleet);
  const { recentTrips } = useAppSelector((state) => state.trip);

  const stats = [
    { label: "ACTIVE VEHICLES", value: "53", color: "border-l-blue-500" },
    { label: "AVAILABLE VEHICLES", value: "42", color: "border-l-green-500" },
    { label: "VEHICLES IN MAINTENANCE", value: "05", color: "border-l-orange-500" },
    { label: "ACTIVE TRIPS", value: "18", color: "border-l-blue-500" },
    { label: "PENDING TRIPS", value: "09", color: "border-l-gray-400" },
    { label: "DRIVERS ON DUTY", value: "26", color: "border-l-gray-400" },
    { label: "FLEET UTILIZATION", value: "81%", color: "border-l-green-500" },
  ];

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
                  <th className="px-4 py-3 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTrips.map((trip, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">{trip.id}</td>
                    <td className="px-4 py-3">{trip.vehicle}</td>
                    <td className="px-4 py-3">{trip.driver}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium text-black ${
                        trip.status === 'On Trip' ? 'bg-blue-400' :
                        trip.status === 'Completed' ? 'bg-green-500' :
                        trip.status === 'Dispatched' ? 'bg-blue-400' : 'bg-gray-400'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{trip.eta}</td>
                  </tr>
                ))}
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
                <div className="h-full bg-green-500 w-[75%]"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm">On Trip</div>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[30%]"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm">In Shop</div>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[10%]"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm">Retired</div>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchVehicles } from "@/store/slices/fleetSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function VehicleRegistryPage() {
  const dispatch = useAppDispatch();
  const { vehicles, loading } = useAppSelector((state) => state.fleet);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[calc(50%-0.5rem)] sm:w-[150px] h-9 bg-card border-border/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Mini">Mini</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[calc(50%-0.5rem)] sm:w-[150px] h-9 bg-card border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="On Trip">On Trip</SelectItem>
              <SelectItem value="In Shop">In Shop</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="search"
            placeholder="Search reg. no..."
            className="w-full sm:w-[250px] bg-card border-border/50 h-9 focus-visible:ring-primary/50"
          />
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">REG. NO.</th>
                <th className="px-6 py-4 font-semibold">NAME/MODEL</th>
                <th className="px-6 py-4 font-semibold">TYPE</th>
                <th className="px-6 py-4 font-semibold">CAPACITY (kg)</th>
                <th className="px-6 py-4 font-semibold">ODOMETER</th>
                <th className="px-6 py-4 font-semibold">ACQ. COST</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading vehicles...</td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No vehicles found.</td>
                </tr>
              ) : vehicles.map((v) => (
                <tr key={v._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-primary/80">{v.regNumber}</td>
                  <td className="px-6 py-4">{v.modelName}</td>
                  <td className="px-6 py-4">{v.type}</td>
                  <td className="px-6 py-4">{v.capacity}</td>
                  <td className="px-6 py-4">{v.odometer?.toLocaleString()} km</td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">${v.acquisitionCost?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm ${
                      v.status === 'Available' ? 'bg-green-500' :
                      v.status === 'On Trip' ? 'bg-blue-400' :
                      v.status === 'In Shop' ? 'bg-orange-500' : 'bg-red-400'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function VehicleRegistryPage() {
  const { vehicles } = useAppSelector((state) => state.fleet);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-9 bg-transparent border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="mini">Mini</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-9 bg-transparent border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on_trip">On Trip</SelectItem>
              <SelectItem value="in_shop">In Shop</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="search"
            placeholder="Search reg. no..."
            className="w-[250px] bg-transparent border-border h-9"
          />
        </div>
        <Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">REG. NO. (UNIQUE)</th>
              <th className="px-6 py-4 font-medium">NAME/MODEL</th>
              <th className="px-6 py-4 font-medium">TYPE</th>
              <th className="px-6 py-4 font-medium">CAPACITY</th>
              <th className="px-6 py-4 font-medium">ODOMETER</th>
              <th className="px-6 py-4 font-medium">ACQ. COST</th>
              <th className="px-6 py-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-mono">{v.regNo}</td>
                <td className="px-6 py-4">{v.name}</td>
                <td className="px-6 py-4">{v.type}</td>
                <td className="px-6 py-4">{v.capacity}</td>
                <td className="px-6 py-4">{v.odometer}</td>
                <td className="px-6 py-4">{v.acqCost}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-medium text-black ${
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

      <p className="text-xs text-[#c2843b] italic">
        Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher
      </p>
    </div>
  );
}

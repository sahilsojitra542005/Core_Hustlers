"use client";

import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DriversPage() {
  const { drivers } = useAppSelector((state) => state.driver);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold opacity-0">Drivers</h2> {/* Spacer for alignment if needed, or remove */}
        <div className="flex items-center gap-4">
          <Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">DRIVER</th>
              <th className="px-6 py-4 font-medium">LICENSE NO.</th>
              <th className="px-6 py-4 font-medium">CATEGORY</th>
              <th className="px-6 py-4 font-medium">EXPIRY</th>
              <th className="px-6 py-4 font-medium">CONTACT</th>
              <th className="px-6 py-4 font-medium">TRIP COMPL.</th>
              <th className="px-6 py-4 font-medium">SAFETY</th>
              <th className="px-6 py-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drivers.map((d, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{d.name}</td>
                <td className="px-6 py-4 font-mono">{d.licenseNo}</td>
                <td className="px-6 py-4">{d.category}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {d.expiry.includes("EXPIRE") ? (
                    <span className="text-red-400">{d.expiry}</span>
                  ) : d.expiry}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{d.contact}</td>
                <td className="px-6 py-4">{d.tripCompl}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-medium text-black ${
                    d.safety === 'Available' ? 'bg-green-500' :
                    d.safety === 'On Trip' ? 'bg-blue-400' :
                    d.safety === 'Suspended' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    {d.safety}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-medium text-black ${
                    d.status === 'Available' ? 'bg-green-500' :
                    d.status === 'On Trip' ? 'bg-blue-400' :
                    d.status === 'Suspended' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">TOGGLE STAT</h4>
          <div className="flex gap-4">
            <span className="px-4 py-1.5 bg-green-500 text-black text-sm font-medium rounded-md cursor-pointer hover:opacity-90">Available</span>
            <span className="px-4 py-1.5 bg-blue-400 text-black text-sm font-medium rounded-md cursor-pointer hover:opacity-90">On Trip</span>
            <span className="px-4 py-1.5 bg-gray-400 text-black text-sm font-medium rounded-md cursor-pointer hover:opacity-90">Off Duty</span>
            <span className="px-4 py-1.5 bg-orange-500 text-black text-sm font-medium rounded-md cursor-pointer hover:opacity-90">Suspended</span>
          </div>
        </div>

        <p className="text-xs text-[#c2843b] italic mt-4">
          Rule: Expired license or Suspended status → blocked from trip assignment
        </p>
      </div>
    </div>
  );
}

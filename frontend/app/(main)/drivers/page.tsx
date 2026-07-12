"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchDrivers } from "@/store/slices/driverSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DriversPage() {
  const dispatch = useAppDispatch();
  const { drivers, loading } = useAppSelector((state) => state.driver);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const isExpired = (dateStr: string) => {
    try {
      return new Date(dateStr) < new Date();
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold opacity-0">Drivers</h2>
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
              <th className="px-6 py-4 font-medium">SAFETY SCORE</th>
              <th className="px-6 py-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">Loading drivers...</td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No drivers found.</td>
              </tr>
            ) : drivers.map((d) => (
              <tr key={d._id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{d.name}</td>
                <td className="px-6 py-4 font-mono">{d.licenseNumber}</td>
                <td className="px-6 py-4">{d.licenseCategory}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {isExpired(d.licenseExpiryDate) ? (
                    <span className="text-red-400">{formatDate(d.licenseExpiryDate)} (EXPIRED)</span>
                  ) : formatDate(d.licenseExpiryDate)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{d.contactNumber}</td>
                <td className="px-6 py-4">{d.tripCompletionRate}%</td>
                <td className="px-6 py-4">{d.safetyScore}/100</td>
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

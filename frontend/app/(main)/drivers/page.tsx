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

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">DRIVER</th>
                <th className="px-6 py-4 font-semibold">LICENSE NO.</th>
                <th className="px-6 py-4 font-semibold">CATEGORY</th>
                <th className="px-6 py-4 font-semibold">EXPIRY</th>
                <th className="px-6 py-4 font-semibold">CONTACT</th>
                <th className="px-6 py-4 font-semibold">TRIP COMPL.</th>
                <th className="px-6 py-4 font-semibold">SAFETY SCORE</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading drivers...</td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">No drivers found.</td>
                </tr>
              ) : drivers.map((d) => (
                <tr key={d._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary/80">{d.name}</td>
                  <td className="px-6 py-4 font-mono">{d.licenseNumber}</td>
                  <td className="px-6 py-4">{d.licenseCategory}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {isExpired(d.licenseExpiryDate) ? (
                      <span className="text-red-400 font-semibold">{formatDate(d.licenseExpiryDate)} (EXPIRED)</span>
                    ) : formatDate(d.licenseExpiryDate)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{d.contactNumber}</td>
                  <td className="px-6 py-4">{d.tripCompletionRate}%</td>
                  <td className="px-6 py-4">{d.safetyScore}/100</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm ${
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
      </div>
    </div>
  );
}

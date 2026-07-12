"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchMaintenanceLogs } from "@/store/slices/maintenanceSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function MaintenancePage() {
  const dispatch = useAppDispatch();
  const { records, loading } = useAppSelector((state) => state.maintenance);

  useEffect(() => {
    dispatch(fetchMaintenanceLogs());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column: Log Service Record */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">MOCK LOG SERVICE (PREVIEW)</h3>
          <form className="space-y-4 opacity-75">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">VEHICLE</Label>
              <Input value="VAN-05" className="bg-transparent border-border h-10" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">SERVICE TYPE</Label>
              <Input value="Oil Change" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">COST</Label>
              <Input value="2500" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">DATE</Label>
              <Input value="07/07/2026" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">STATUS</Label>
              <Input value="Active" className="bg-transparent border-border h-10" readOnly />
            </div>

            <Button disabled className="w-full bg-[#c2843b] hover:bg-[#b4752c] text-white h-11 mt-6">
              Save (Disabled)
            </Button>
          </form>
        </div>

        <div className="space-y-3 pt-6 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-green-500 w-20">Available</span>
            <div className="flex-1 flex items-center text-muted-foreground text-[10px] uppercase">
              <div className="h-px bg-muted-foreground/50 flex-1"></div>
              <span className="px-2">creating active record</span>
              <div className="h-px bg-muted-foreground/50 flex-1"></div>
              <ArrowRight className="w-3 h-3 -ml-1 text-muted-foreground/50" />
            </div>
            <span className="text-orange-500 w-20">In Shop</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-orange-500 w-20">In Shop</span>
            <div className="flex-1 flex items-center text-muted-foreground text-[10px] uppercase">
              <div className="h-px bg-muted-foreground/50 flex-1"></div>
              <span className="px-2">closing record</span>
              <div className="h-px bg-muted-foreground/50 flex-1"></div>
              <ArrowRight className="w-3 h-3 -ml-1 text-muted-foreground/50" />
            </div>
            <span className="text-green-500 w-20">Available</span>
          </div>

          <p className="text-xs text-[#c2843b] italic mt-4">
            Note: In Shop vehicles are removed from the dispatch pool.
          </p>
        </div>
      </div>

      {/* Right Column: Service Log */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">SERVICE LOG</h3>
        
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">VEHICLE</th>
                <th className="px-4 py-3 font-medium">SERVICE</th>
                <th className="px-4 py-3 font-medium">COST</th>
                <th className="px-4 py-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading maintenance logs...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No maintenance logs found.</td>
                </tr>
              ) : records.map((record) => (
                <tr key={record._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-mono">{record.vehicle?.regNumber || 'Unknown'}</td>
                  <td className="px-4 py-3">{record.maintenanceType}</td>
                  <td className="px-4 py-3">{record.cost?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold text-black uppercase ${
                      record.status === 'Closed' ? 'bg-green-500' :
                      record.status === 'In Shop' || record.status === 'Active' ? 'bg-orange-500' : 'bg-gray-400'
                    }`}>
                      {record.status}
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

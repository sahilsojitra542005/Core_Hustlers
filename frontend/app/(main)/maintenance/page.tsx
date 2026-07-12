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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: Log Service Record */}
      <div className="space-y-8">
        <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">MOCK LOG SERVICE (PREVIEW)</h3>
          <form className="space-y-5 opacity-80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">VEHICLE</Label>
                <Input value="VAN-05" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">SERVICE TYPE</Label>
                <Input value="Oil Change" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">COST</Label>
                <Input value="2500" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DATE</Label>
                <Input value="07/07/2026" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">STATUS</Label>
              <Input value="Active" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
            </div>

            <Button disabled className="w-full bg-secondary/50 text-muted-foreground h-11 mt-6 rounded-xl transition-colors">
              Save (Disabled)
            </Button>
          </form>
        </div>

        <div className="space-y-4 pt-6 px-2">
          <h4 className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-2">VEHICLE STATE TRANSITIONS</h4>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-green-500 w-20">Available</span>
            <div className="flex-1 flex items-center text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <div className="h-px bg-muted-foreground/30 flex-1"></div>
              <span className="px-3">creating record</span>
              <div className="h-px bg-muted-foreground/30 flex-1"></div>
              <ArrowRight className="w-3.5 h-3.5 -ml-1 text-muted-foreground/50" />
            </div>
            <span className="text-orange-500 w-20 text-right">In Shop</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-orange-500 w-20">In Shop</span>
            <div className="flex-1 flex items-center text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <div className="h-px bg-muted-foreground/30 flex-1"></div>
              <span className="px-3">closing record</span>
              <div className="h-px bg-muted-foreground/30 flex-1"></div>
              <ArrowRight className="w-3.5 h-3.5 -ml-1 text-muted-foreground/50" />
            </div>
            <span className="text-green-500 w-20 text-right">Available</span>
          </div>
        </div>
      </div>

      {/* Right Column: Service Log */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">SERVICE LOG</h3>
        
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <tr>
                  <th className="px-5 py-4 font-semibold">VEHICLE</th>
                  <th className="px-5 py-4 font-semibold">SERVICE</th>
                  <th className="px-5 py-4 font-semibold">COST</th>
                  <th className="px-5 py-4 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground animate-pulse">Loading maintenance logs...</td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">No maintenance logs found.</td>
                  </tr>
                ) : records.map((record) => (
                  <tr key={record._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-medium text-primary/80">{record.vehicle?.regNumber || 'Unknown'}</td>
                    <td className="px-5 py-4">{record.maintenanceType}</td>
                    <td className="px-5 py-4 font-medium text-muted-foreground">${record.cost?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm ${
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
    </div>
  );
}

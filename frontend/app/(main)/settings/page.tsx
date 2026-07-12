"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchSettings } from "@/store/slices/settingsSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const rbacRoles = [
    { role: "Fleet Manager", fleet: "✓", drivers: "✓", trips: "-", fuel: "-", analytics: "✓" },
    { role: "Dispatcher", fleet: "view", drivers: "-", trips: "✓", fuel: "-", analytics: "-" },
    { role: "Safety Officer", fleet: "-", drivers: "✓", trips: "view", fuel: "-", analytics: "-" },
    { role: "Financial Analyst", fleet: "view", drivers: "-", trips: "-", fuel: "✓", analytics: "✓" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Left Column: General */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">GENERAL</h3>
        {loading && !settings ? (
          <div className="text-sm text-muted-foreground">Loading settings...</div>
        ) : (
          <form className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">DEPOT NAME</Label>
              <Input defaultValue={settings?.depotName || ''} className="bg-transparent border-border h-10" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">CURRENCY</Label>
              <Input defaultValue={settings?.currency || ''} className="bg-transparent border-border h-10" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">DISTANCE UNIT</Label>
              <Input defaultValue={settings?.distanceUnit || ''} className="bg-transparent border-border h-10" />
            </div>

            <Button disabled className="w-40 bg-blue-500 hover:bg-blue-600 text-white mt-4 h-10">
              Save changes
            </Button>
          </form>
        )}
      </div>

      {/* Right Column: RBAC */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">ROLE-BASED ACCESS (RBAC)</h3>
        
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-[10px] text-muted-foreground uppercase border-b border-border tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">ROLE</th>
                <th className="px-4 py-3 font-medium text-center">FLEET</th>
                <th className="px-4 py-3 font-medium text-center">DRIVERS</th>
                <th className="px-4 py-3 font-medium text-center">TRIPS</th>
                <th className="px-4 py-3 font-medium text-center">FUEL/EXP.</th>
                <th className="px-4 py-3 font-medium text-center">ANALYTICS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rbacRoles.map((item, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.role}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{item.fleet}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{item.drivers}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{item.trips}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{item.fuel}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{item.analytics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

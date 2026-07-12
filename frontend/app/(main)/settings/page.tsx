"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchSettings, updateSettings } from "@/store/slices/settingsSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const ALL_ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "Admin"];
const ALL_ROUTES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/fleet", name: "Fleet" },
  { path: "/drivers", name: "Drivers" },
  { path: "/trips", name: "Trips" },
  { path: "/maintenance", name: "Maintenance" },
  { path: "/fuel-expenses", name: "Fuel & Expenses" },
  { path: "/analytics", name: "Analytics" },
  { path: "/settings", name: "Settings" }
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.settings);

  const { user } = useAppSelector((state) => state.auth);
  const [localRouteRoles, setLocalRouteRoles] = useState<Record<string, string[]>>({});

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings?.routeRoles) {
      setLocalRouteRoles(settings.routeRoles);
    }
  }, [settings]);

  const handleRoleToggle = (route: string, role: string) => {
    setLocalRouteRoles(prev => {
      const currentRoles = prev[route] || [];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role];
      return {
        ...prev,
        [route]: newRoles
      };
    });
  };

  const saveRbacSettings = async () => {
    try {
      await dispatch(updateSettings({ routeRoles: localRouteRoles })).unwrap();
      toast.success("Access control settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save access control settings");
    }
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: General */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">GENERAL PREFERENCES</h3>
        <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
          {loading && !settings ? (
            <div className="text-sm text-muted-foreground animate-pulse">Loading settings...</div>
          ) : (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DEPOT NAME</Label>
                <Input defaultValue={settings?.depotName || ''} className="bg-white/5 border-border/50 h-12 focus-visible:ring-primary/50 text-foreground transition-all" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CURRENCY</Label>
                <Input defaultValue={settings?.currency || ''} className="bg-white/5 border-border/50 h-12 focus-visible:ring-primary/50 text-foreground transition-all" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DISTANCE UNIT</Label>
                <Input defaultValue={settings?.distanceUnit || ''} className="bg-white/5 border-border/50 h-12 focus-visible:ring-primary/50 text-foreground transition-all" />
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button disabled className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-xl shadow-md transition-all">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Column: Access Control */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">ACCESS CONTROL (RBAC)</h3>
        <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm space-y-6">
          {user?.role === "Admin" ? (
            <div className="flex flex-col gap-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-muted-foreground border-collapse">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="py-3 px-2 font-semibold text-primary sticky left-0 bg-card/95 backdrop-blur-sm z-10">Route</th>
                      {ALL_ROLES.map(role => (
                        <th key={role} className="py-3 px-2 font-semibold text-center whitespace-nowrap min-w-[120px]">{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_ROUTES.map((route) => (
                      <tr key={route.path} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-medium text-foreground sticky left-0 bg-card/95 backdrop-blur-sm z-10">
                          {route.name}
                        </td>
                        {ALL_ROLES.map(role => {
                          const isChecked = (localRouteRoles[route.path] || []).includes(role);
                          // Admin is implicitly allowed everywhere, but let's just make it checked and disabled for clarity
                          const isDisabled = role === "Admin";
                          return (
                            <td key={role} className="py-3 px-2 text-center">
                              <Checkbox 
                                checked={isChecked || isDisabled} 
                                disabled={isDisabled}
                                onCheckedChange={() => handleRoleToggle(route.path, role)}
                                className="mx-auto border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-4 border-t border-border/50 flex justify-end">
                <Button onClick={saveRbacSettings} className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-xl shadow-md transition-all">
                  Save Access Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 space-y-2">
                <h4 className="text-sm font-semibold text-yellow-500">Read-Only View</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Only System Administrators can edit Role-Based Access Control settings.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_ROLES.map(role => (
                  <div key={role} className="p-4 rounded-xl border border-border/50 bg-white/5 space-y-2">
                    <h4 className="text-sm font-semibold text-primary">{role}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ALL_ROUTES.filter(route => (settings?.routeRoles?.[route.path] || []).includes(role)).map(route => (
                        <span key={route.path} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/50">
                          {route.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

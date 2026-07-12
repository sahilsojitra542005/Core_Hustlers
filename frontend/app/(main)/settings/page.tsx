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

      {/* Right Column: System Status */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">SYSTEM STATUS</h3>
        <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white/5">
            <div>
              <h4 className="text-sm font-semibold text-foreground">API Connection</h4>
              <p className="text-xs text-muted-foreground mt-1">Backend service status</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Online</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white/5">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Database</h4>
              <p className="text-xs text-muted-foreground mt-1">MongoDB cluster status</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Connected</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-white/5">
            <div>
              <h4 className="text-sm font-semibold text-foreground">App Version</h4>
              <p className="text-xs text-muted-foreground mt-1">Current frontend release</p>
            </div>
            <div className="text-sm font-mono text-muted-foreground bg-secondary/50 px-3 py-1 rounded-md">
              v1.0.0-rc.1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

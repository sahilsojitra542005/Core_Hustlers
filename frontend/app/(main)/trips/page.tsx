"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchTrips } from "@/store/slices/tripSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { AddTripDialog } from "@/components/dialogs/AddTripDialog";

export default function TripDispatcherPage() {
  const dispatch = useAppDispatch();
  const { trips, loading } = useAppSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const liveTrips = trips.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: Create Trip & Lifecycle */}
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">TRIP LIFECYCLE</h3>
          <AddTripDialog />
        </div>
        
        <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between relative px-2 sm:px-6">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -z-10"></div>
            
            <div className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 ring-4 ring-background shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Draft</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-400 ring-4 ring-background shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Dispatched</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className="w-3.5 h-3.5 rounded-full bg-gray-500 ring-4 ring-background shadow-[0_0_10px_rgba(107,114,128,0.5)]"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 bg-transparent px-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400 ring-4 ring-background shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Cancelled</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">MOCK DISPATCH FORM (PREVIEW)</h3>
          <form className="space-y-5 opacity-80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">SOURCE</Label>
                <Input value="Gandhinagar Depot" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DESTINATION</Label>
                <Input value="Ahmedabad Hub" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">VEHICLE (AVAILABLE ONLY)</Label>
                <Input value="VAN-05 - 500 kg capacity" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DRIVER (AVAILABLE ONLY)</Label>
                <Input value="Alex" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CARGO WEIGHT (KG)</Label>
                <Input value="700" className="bg-white/5 border-red-500/50 h-11 focus-visible:ring-red-500 text-foreground shadow-[0_0_10px_rgba(239,68,68,0.1)]" readOnly />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">PLANNED DISTANCE (KM)</Label>
                <Input value="38" className="bg-white/5 border-border/50 h-11 focus-visible:ring-primary/50 text-foreground" readOnly />
              </div>
            </div>

            {/* Error State for Capacity */}
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-red-200 text-sm shadow-xl mt-6 animate-in fade-in">
              <div className="flex gap-3 items-start">
                <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-400 mb-2">Capacity Check Failed</div>
                  <div className="text-red-300/80 text-xs mb-1">Vehicle Capacity: 500 kg</div>
                  <div className="text-red-300/80 text-xs mb-2">Cargo Weight: 700 kg</div>
                  <div className="text-[11px] font-medium mt-2 p-2 bg-red-950/30 rounded text-red-300">
                    Capacity exceeded by 200 kg — dispatch blocked
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button disabled className="flex-1 bg-secondary/50 text-muted-foreground h-11 rounded-xl">
                Dispatch (disabled)
              </Button>
              <Button variant="outline" className="flex-1 border-border/50 text-foreground hover:bg-secondary/50 h-11 rounded-xl transition-colors">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live Board */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm h-fit">
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6 flex items-center justify-between">
          <span>LIVE BOARD</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
        </h3>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-muted-foreground animate-pulse p-4 rounded-xl border border-border/50 bg-white/5">Loading live trips...</div>
          ) : liveTrips.length === 0 ? (
            <div className="text-sm text-muted-foreground border border-dashed border-border/50 rounded-xl p-8 text-center bg-white/5">No active trips found.</div>
          ) : liveTrips.map((trip) => (
            <div key={trip._id} className="p-5 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 transition-colors shadow-sm group">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="min-w-0">
                  <div className="text-muted-foreground font-mono text-[11px] mb-1.5 flex items-center gap-2">
                    {trip.tripId}
                  </div>
                  <div className="font-semibold text-sm truncate bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    {trip.source} <span className="text-primary mx-1">→</span> {trip.destination}
                  </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground text-right shrink-0 bg-secondary/30 px-2 py-1 rounded">
                  {trip.vehicle?.regNumber || 'No Vehicle'} / {trip.driver?.name || 'No Driver'}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-border/50">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm ${
                    trip.status === 'Dispatched' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]' :
                    trip.status === 'Draft' ? 'bg-gray-400' :
                    trip.status === 'Cancelled' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'bg-gray-400'
                  }`}>
                  {trip.status}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{trip.plannedDistance} km</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

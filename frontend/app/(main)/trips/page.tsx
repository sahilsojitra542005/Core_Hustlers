"use client";

import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TripDispatcherPage() {
  const { liveTrips } = useAppSelector((state) => state.trip);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column: Create Trip & Lifecycle */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">TRIP LIFECYCLE</h3>
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10"></div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-2">
              <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-background"></div>
              <span className="text-[10px] font-semibold text-green-500 uppercase">Draft</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-2">
              <div className="w-3 h-3 rounded-full bg-blue-400 ring-4 ring-background"></div>
              <span className="text-[10px] font-semibold text-blue-400 uppercase">Dispatched</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-2">
              <div className="w-3 h-3 rounded-full bg-gray-600 ring-4 ring-background"></div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Completed</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-2">
              <div className="w-3 h-3 rounded-full bg-gray-600 ring-4 ring-background"></div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Cancelled</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">CREATE TRIP</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">SOURCE</Label>
              <Input value="Gandhinagar Depot" className="bg-transparent border-border h-10" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">DESTINATION</Label>
              <Input value="Ahmedabad Hub" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">VEHICLE (AVAILABLE ONLY)</Label>
              <Input value="VAN-05 - 500 kg capacity" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">DRIVER (AVAILABLE ONLY)</Label>
              <Input value="Alex" className="bg-transparent border-border h-10" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">CARGO WEIGHT (KG)</Label>
              <Input value="700" className="bg-transparent border-border h-10 border-red-500/50 focus-visible:ring-red-500" readOnly />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">PLANNED DISTANCE (KM)</Label>
              <Input value="38" className="bg-transparent border-border h-10" readOnly />
            </div>

            {/* Error State for Capacity */}
            <div className="p-4 rounded-xl border border-dashed border-red-500/50 bg-red-950/10 text-red-400 text-sm mt-6">
              <div className="mb-1">Vehicle Capacity: 500 kg</div>
              <div className="mb-2">Cargo Weight: 700 kg</div>
              <div className="flex gap-2 items-center font-semibold">
                <X size={16} className="text-red-500" />
                Capacity exceeded by 200 kg — dispatch blocked
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button disabled className="flex-1 bg-secondary text-muted-foreground h-11">
                Dispatch (disabled)
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary h-11">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live Board */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">LIVE BOARD</h3>
        
        <div className="space-y-4">
          {liveTrips.map((trip) => (
            <div key={trip.id} className="p-4 rounded-lg border border-border border-dashed bg-card/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-muted-foreground font-mono text-xs mb-1">{trip.id}</div>
                  <div className="font-medium text-sm">{trip.source} → {trip.destination}</div>
                </div>
                <div className="text-xs font-medium text-muted-foreground text-right">
                  {trip.vehicle} / {trip.driver}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <span className={`px-3 py-1.5 rounded-md text-xs font-medium text-black ${
                    trip.status === 'Dispatched' ? 'bg-blue-400' :
                    trip.status === 'Draft' ? 'bg-gray-400' :
                    trip.status === 'Cancelled' ? 'bg-red-400' : 'bg-gray-400'
                  }`}>
                  {trip.status}
                </span>
                <span className="text-xs text-muted-foreground">{trip.eta}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground italic mt-8 text-center sm:text-left">
          On Complete: odometer → Fuel log → expenses → Vehicle & Driver Available
        </p>
      </div>
    </div>
  );
}

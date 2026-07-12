import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createDraftTrip } from "@/store/slices/tripSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function AddTripDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    cargoWeight: 0,
    plannedDistance: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createDraftTrip({
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance)
      })).unwrap();
      
      toast.success("Draft trip created successfully");
      setOpen(false);
      setFormData({
        source: "",
        destination: "",
        cargoWeight: 0,
        plannedDistance: 0,
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full sm:w-auto bg-[#c2843b] hover:bg-[#b4752c] text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" />}>
        <Plus className="mr-2 h-4 w-4" /> Create Trip
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Create Draft Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input 
              id="source" 
              required 
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="bg-secondary/50 border-border/50" 
              placeholder="Origin city/address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input 
              id="destination" 
              required 
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="bg-secondary/50 border-border/50" 
              placeholder="Destination city/address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Cargo Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number"
                required 
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input 
                id="distance" 
                type="number"
                required 
                value={formData.plannedDistance}
                onChange={(e) => setFormData({ ...formData, plannedDistance: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Draft
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

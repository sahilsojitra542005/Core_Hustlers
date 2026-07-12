import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createVehicle } from "@/store/slices/fleetSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function AddVehicleDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    regNumber: "",
    modelName: "",
    type: "Van",
    capacity: 0,
    odometer: 0,
    acquisitionCost: 0,
    status: "Available" as "Available" | "On Trip" | "In Shop" | "Retired",
    region: "All"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (Number(formData.capacity) <= 0) {
      toast.error("Capacity must be greater than 0");
      setLoading(false);
      return;
    }
    if (Number(formData.odometer) < 0) {
      toast.error("Odometer cannot be negative");
      setLoading(false);
      return;
    }
    if (Number(formData.acquisitionCost) < 0) {
      toast.error("Acquisition cost cannot be negative");
      setLoading(false);
      return;
    }

    try {
      await dispatch(createVehicle({
        ...formData,
        capacity: Number(formData.capacity),
        odometer: Number(formData.odometer),
        acquisitionCost: Number(formData.acquisitionCost)
      })).unwrap();
      
      toast.success("Vehicle added successfully");
      setOpen(false);
      setFormData({
        regNumber: "",
        modelName: "",
        type: "Van",
        capacity: 1000,
        odometer: 0,
        acquisitionCost: 0,
        status: "Available",
        region: "All"
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Vehicle
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration No.</Label>
              <Input 
                id="regNumber" 
                required 
                minLength={2}
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                className="bg-secondary/50 border-border/50 uppercase" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input 
                id="modelName" 
                required 
                minLength={2}
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Mini">Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (kg)</Label>
              <Input 
                id="capacity" 
                type="number"
                required 
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input 
                id="odometer" 
                type="number"
                required 
                min="0"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Acquisition Cost</Label>
              <Input 
                id="cost" 
                type="number"
                required 
                min="0"
                value={formData.acquisitionCost}
                onChange={(e) => setFormData({ ...formData, acquisitionCost: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({ ...formData, status: val as any })}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input 
                id="region" 
                required 
                minLength={2}
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Vehicle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

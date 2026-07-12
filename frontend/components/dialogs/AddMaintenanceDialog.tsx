import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logMaintenance } from "@/store/slices/maintenanceSlice";
import { fetchVehicles } from "@/store/slices/fleetSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function AddMaintenanceDialog() {
  const dispatch = useAppDispatch();
  const { vehicles } = useAppSelector((state) => state.fleet);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    maintenanceType: "",
    cost: 0,
    startDate: "",
    description: "",
    status: "In Shop" as "Active" | "Closed" | "In Shop" | "Available"
  });

  useEffect(() => {
    if (open && vehicles.length === 0) {
      dispatch(fetchVehicles());
    }
  }, [open, vehicles.length, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(logMaintenance({
        ...formData,
        cost: Number(formData.cost)
      })).unwrap();
      
      toast.success("Maintenance logged successfully");
      setOpen(false);
      setFormData({
        vehicleId: "",
        maintenanceType: "",
        cost: 0,
        startDate: "",
        description: "",
        status: "In Shop"
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to log maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full sm:w-auto bg-[#c2843b] hover:bg-[#b4752c] text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" />}>
        <Plus className="mr-2 h-4 w-4" /> Log Service
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Log Maintenance Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select 
              value={formData.vehicleId} 
              onValueChange={(val) => setFormData({ ...formData, vehicleId: val })}
              required
            >
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(v => (
                  <SelectItem key={v._id} value={v._id}>
                    {v.regNumber} ({v.modelName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Service Type</Label>
            <Input 
              id="type" 
              required 
              value={formData.maintenanceType}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              className="bg-secondary/50 border-border/50" 
              placeholder="e.g. Oil Change, Tire Replacement"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input 
                id="cost" 
                type="number"
                required 
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Date</Label>
              <Input 
                id="startDate" 
                type="date"
                required 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-secondary/50 border-border/50 [color-scheme:dark]" 
              />
            </div>
          </div>

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
                <SelectItem value="In Shop">In Shop</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description (Optional)</Label>
            <Input 
              id="desc" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary/50 border-border/50" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Log Maintenance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logFuel } from "@/store/slices/expenseSlice";
import { fetchVehicles } from "@/store/slices/fleetSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function LogFuelDialog() {
  const dispatch = useAppDispatch();
  const { vehicles } = useAppSelector((state) => state.fleet);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    liters: 0,
    cost: 0,
    date: ""
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
      await dispatch(logFuel({
        ...formData,
        liters: Number(formData.liters),
        cost: Number(formData.cost)
      })).unwrap();
      
      toast.success("Fuel logged successfully");
      setOpen(false);
      setFormData({
        vehicleId: "",
        liters: 0,
        cost: 0,
        date: ""
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to log fuel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" />}>
        <Plus className="mr-2 h-4 w-4" /> Log Fuel
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Log Fuel</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Liters</Label>
              <Input 
                id="liters" 
                type="number"
                required 
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date"
              required 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-secondary/50 border-border/50 [color-scheme:dark]" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Fuel Log
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

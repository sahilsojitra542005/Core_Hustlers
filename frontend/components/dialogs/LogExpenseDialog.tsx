import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logExpense } from "@/store/slices/expenseSlice";
import { fetchVehicles } from "@/store/slices/fleetSlice";
import { fetchTrips } from "@/store/slices/tripSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function LogExpenseDialog() {
  const dispatch = useAppDispatch();
  const { vehicles } = useAppSelector((state) => state.fleet);
  const { trips } = useAppSelector((state) => state.trip);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: "",
    tripId: "",
    toll: 0,
    other: 0,
    date: "",
    description: ""
  });

  useEffect(() => {
    if (open) {
      if (vehicles.length === 0) dispatch(fetchVehicles());
      if (trips.length === 0) dispatch(fetchTrips());
    }
  }, [open, vehicles.length, trips.length, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(logExpense({
        ...formData,
        tripId: formData.tripId === "none" ? undefined : formData.tripId,
        toll: Number(formData.toll),
        other: Number(formData.other)
      })).unwrap();
      
      toast.success("Expense logged successfully");
      setOpen(false);
      setFormData({
        vehicleId: "",
        tripId: "",
        toll: 0,
        other: 0,
        date: "",
        description: ""
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to log expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Expense
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
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
            <Label>Trip (Optional)</Label>
            <Select 
              value={formData.tripId} 
              onValueChange={(val) => setFormData({ ...formData, tripId: val })}
            >
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {trips.map(t => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.tripId} ({t.source} to {t.destination})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toll">Toll ($)</Label>
              <Input 
                id="toll" 
                type="number"
                required 
                value={formData.toll}
                onChange={(e) => setFormData({ ...formData, toll: Number(e.target.value) })}
                className="bg-secondary/50 border-border/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other">Other ($)</Label>
              <Input 
                id="other" 
                type="number"
                required 
                value={formData.other}
                onChange={(e) => setFormData({ ...formData, other: Number(e.target.value) })}
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

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input 
              id="desc" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary/50 border-border/50" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

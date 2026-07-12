import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createDriver } from "@/store/slices/driverSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function AddDriverDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiryDate: "",
    contactNumber: "",
    status: "Available" as "Available" | "On Trip" | "Off Duty" | "Suspended"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createDriver(formData)).unwrap();
      toast.success("Driver added successfully");
      setOpen(false);
      setFormData({
        name: "",
        licenseNumber: "",
        licenseCategory: "LMV",
        licenseExpiryDate: "",
        contactNumber: "",
        status: "Available"
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to add driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white" />}>
        <Plus className="mr-2 h-4 w-4" /> Add Driver
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111111] text-white border-border/50">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary/50 border-border/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <Input 
              id="license" 
              required 
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="bg-secondary/50 border-border/50" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.licenseCategory} 
                onValueChange={(val) => setFormData({ ...formData, licenseCategory: val })}
              >
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LMV">LMV</SelectItem>
                  <SelectItem value="HMV">HMV</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry">License Expiry Date</Label>
            <Input 
              id="expiry" 
              type="date" 
              required 
              value={formData.licenseExpiryDate}
              onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
              className="bg-secondary/50 border-border/50 [color-scheme:dark]" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input 
              id="contact" 
              required 
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="bg-secondary/50 border-border/50" 
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Driver
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, X, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: reduxError, loading } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState("manager@transitops.com");
  const [password, setPassword] = useState("securepassword123");
  const [role, setRole] = useState("Fleet Manager");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const resultAction = await dispatch(loginUser({ email, password, role }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-[#111111] p-12 text-white border-r border-border/50">
        {/* Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <LayoutGrid size={40} className="stroke-[1.5]" />
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            TransitOps
          </h1>
          <p className="text-base text-gray-400 mb-20 font-medium max-w-sm leading-relaxed">
            The next-generation smart transport operations platform. Streamline your fleet, dispatch trips, and monitor maintenance in real-time.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md">
              <h3 className="text-lg font-medium text-white mb-2">Centralized Command</h3>
              <p className="text-sm text-gray-400">Gain total visibility over your logistics ecosystem from a single unified dashboard.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md">
              <h3 className="text-lg font-medium text-white mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-400">Make data-driven decisions with live KPIs, expense tracking, and operational metrics.</p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 font-medium tracking-wider relative z-10 flex items-center justify-between w-full max-w-md">
          <span>TRANSITOPS © 2026</span>
          <span className="text-primary">ENTERPRISE EDITION</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#0a0a0a] p-8 lg:p-12 text-white relative">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8 text-primary">
              <LayoutGrid size={48} className="stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-400">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-white transition-all placeholder:text-gray-600"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">Password</Label>
                <a href="#" className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl text-white transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-primary/50 focus-visible:ring-primary/50 transition-all">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-white/10 text-white rounded-xl shadow-2xl">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                  <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                  <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Checkbox id="remember" className="border-gray-500 rounded text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-gray-300 cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-medium text-[15px] transition-all shadow-[0_4px_14px_0_rgba(194,132,59,0.39)] hover:shadow-[0_6px_20px_rgba(194,132,59,0.23)] hover:-translate-y-[1px] mt-4">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>

        {reduxError && (
          <div className="absolute right-4 top-4 lg:right-8 lg:top-8 max-w-xs p-4 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-red-200 text-sm shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex gap-3 items-start">
              <X size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-400 mb-1">Authentication Failed</div>
                <div className="text-red-300/80 text-xs">{reduxError}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

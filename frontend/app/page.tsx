"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { LayoutGrid, X, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: reduxError, loading } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState("manager@transitops.com");
  const [password, setPassword] = useState("securepassword123");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#cfd5d8] p-12 text-[#333333]">
        <div>
          <div className="flex items-center gap-3 mb-4 text-[#c2843b]">
            <LayoutGrid size={40} className="stroke-1" />
          </div>
          <h1 className="text-3xl font-semibold mb-1 text-black">TransitOps</h1>
          <p className="text-sm text-gray-600 mb-20 font-medium">
            Smart Transport Operations Platform
          </p>

          <h3 className="text-lg font-medium mb-4 text-black">
            One login, four roles:
          </h3>
          <ul className="space-y-3">
            {[
              "Fleet Manager",
              "Dispatcher",
              "Safety Officer",
              "Financial Analyst",
            ].map((r, i) => (
              <li key={i} className="flex items-center gap-3 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c2843b]"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-xs text-gray-500 font-medium tracking-wider">
          TRANSITOPS © 2026 - RBAC ENVI
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#111111] p-8 lg:p-12 text-white relative">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
            <p className="text-sm text-gray-400">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-gray-400 font-semibold tracking-wider">EMAIL</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-gray-700 h-11 focus-visible:ring-primary/50 rounded-lg text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-gray-400 font-semibold tracking-wider">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-gray-700 h-11 focus-visible:ring-primary/50 rounded-lg text-white"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-[#c2843b] hover:bg-[#b4752c] text-white h-11 rounded-lg font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="pt-6">
            <h4 className="text-xs text-gray-500 mb-3 italic">Access is scoped by role after login:</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Fleet Manager → Fleet, Maintenance</li>
              <li>• Dispatcher → Dashboard, Trips</li>
              <li>• Safety Officer → Drivers, Compliance</li>
              <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>
        </div>

        {reduxError && (
          <div className="absolute right-8 top-1/4 max-w-xs p-4 rounded-xl border border-dashed border-red-500/50 bg-red-950/20 text-red-200 text-sm">
            <div className="flex gap-2">
              <X size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-400 mb-1">Login Error</div>
                {reduxError}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Menu, X } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { fetchSettings } from "@/store/slices/settingsSlice";
const ROUTE_ROLES: Record<string, string[]> = {
  "/dashboard": ["Dispatcher", "Financial Analyst", "Admin"],
  "/settings": ["Admin"],
  "/fleet": ["Fleet Manager", "Admin"],
  "/drivers": ["Safety Officer", "Admin"],
  "/trips": ["Dispatcher", "Admin"],
  "/maintenance": ["Fleet Manager", "Admin"],
  "/fuel-expenses": ["Financial Analyst", "Admin"],
  "/analytics": ["Financial Analyst", "Admin"],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, loading } = useAppSelector((state) => state.settings);

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated && !user) {
      router.push("/");
    } else if (isAuthenticated && !settings && !loading) {
      dispatch(fetchSettings());
    }
  }, [isAuthenticated, user, router, dispatch, settings, loading]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Fleet", href: "/fleet" },
    { name: "Drivers", href: "/drivers" },
    { name: "Trips", href: "/trips" },
    { name: "Maintenance", href: "/maintenance" },
    { name: "Fuel & Expenses", href: "/fuel-expenses" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  const userRole = user?.role || "";
  const dynamicRouteRoles = settings?.routeRoles || {
    "/dashboard": ["Dispatcher", "Financial Analyst", "Admin"],
    "/settings": ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "Admin"],
    "/fleet": ["Fleet Manager", "Admin"],
    "/drivers": ["Safety Officer", "Admin"],
    "/trips": ["Dispatcher", "Admin"],
    "/maintenance": ["Fleet Manager", "Admin"],
    "/fuel-expenses": ["Financial Analyst", "Admin"],
    "/analytics": ["Financial Analyst", "Admin"],
  };

  const isAuthorized = (href: string) => {
    // Allow if no user is present yet to prevent flash of unauthorized if state is hydrating
    if (!user) return true;
    const allowedRoles = dynamicRouteRoles[href as keyof typeof dynamicRouteRoles];
    return allowedRoles ? (allowedRoles as string[]).includes(userRole) : true;
  };

  const allowedNavItems = navItems.filter((item) => isAuthorized(item.href));

  // Determine if the current route is authorized
  // Find the matching base route from dynamicRouteRoles for the current pathname
  const currentBaseRoute = Object.keys(dynamicRouteRoles).find(r => pathname.startsWith(r)) || pathname;
  const canAccessCurrentRoute = isAuthorized(currentBaseRoute);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6">
          <Link href="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#ffb86c]">
            TransitOps
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {allowedNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 border border-primary/50 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm">
          <div className="w-64 bg-card border-r border-border h-full flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <Link href="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#ffb86c]" onClick={() => setIsMobileMenuOpen(false)}>
                TransitOps
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {allowedNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200",
                      isActive
                        ? "bg-primary/10 border border-primary/50 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Subtle background gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>

        {/* Topbar */}
        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-secondary/50 pl-9 border-border/50 focus-visible:ring-primary/50 h-9 transition-all hover:bg-secondary/80"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline-block font-medium">
                    {user.email.split('@')[0]}
                  </span>
                  <div className="flex items-center gap-2 border border-primary/20 rounded-full pl-3 pr-1 py-1 text-sm bg-primary/5 shadow-[0_0_15px_rgba(194,132,59,0.1)]">
                    <span className="text-primary font-medium text-xs sm:text-sm">{user.role}</span>
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                      {user.email[0]}
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={() => {
                  dispatch(logout());
                  router.push("/");
                  toast.success("Successfully logged out!");
                }}
                className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-transparent">
          {!canAccessCurrentRoute ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-6 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                <X className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Access Denied</h2>
              <p className="text-muted-foreground max-w-md text-lg">
                Your role <span className="font-semibold text-primary">{userRole}</span> does not have permission to view this page.
              </p>
              <Button 
                onClick={() => {
                  const DEFAULT_ROUTE_FOR_ROLE: Record<string, string> = {
                    "Fleet Manager": "/fleet",
                    "Dispatcher": "/dashboard",
                    "Safety Officer": "/drivers",
                    "Financial Analyst": "/dashboard",
                    "Admin": "/dashboard"
                  };
                  router.push(DEFAULT_ROUTE_FOR_ROLE[userRole] || "/settings");
                }} 
                className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Return Home
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

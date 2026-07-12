"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

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

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            TransitOps
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-transparent border border-primary text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex-1 flex items-center max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-secondary/50 pl-9 border-none h-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  {user.email.split('@')[0]}
                </span>
                <div className="flex items-center gap-2 border border-border rounded-full pl-3 pr-1 py-1 text-sm bg-secondary/30">
                  <span className="text-primary">{user.role}</span>
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs uppercase">
                    {user.email[0]}
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch(logout());
                    router.push("/");
                  }}
                  className="ml-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

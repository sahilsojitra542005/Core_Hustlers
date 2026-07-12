"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchFuelLogs, fetchOtherExpenses, fetchExpenseSummary } from "@/store/slices/expenseSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FuelExpensesPage() {
  const dispatch = useAppDispatch();
  const { fuelLogs, otherExpenses, summary, loading } = useAppSelector((state) => state.expense);

  useEffect(() => {
    dispatch(fetchFuelLogs());
    dispatch(fetchOtherExpenses());
    dispatch(fetchExpenseSummary());
  }, [dispatch]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold opacity-0 hidden sm:block">Fuel & Expenses</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Plus className="mr-2 h-4 w-4" /> Log Fuel
          </Button>
          <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">FUEL LOGS</h3>
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">VEHICLE</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 font-semibold">LITERS</th>
                  <th className="px-6 py-4 font-semibold">FUEL COST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading && fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading fuel logs...</td>
                  </tr>
                ) : fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No fuel logs found.</td>
                  </tr>
                ) : fuelLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary/80">{log.vehicle?.regNumber || 'Unknown'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(log.date)}</td>
                    <td className="px-6 py-4">{log.liters} L</td>
                    <td className="px-6 py-4 font-medium">${log.cost?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">OTHER EXPENSES (TOLL / MISC)</h3>
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">TRIP</th>
                  <th className="px-6 py-4 font-semibold">VEHICLE</th>
                  <th className="px-6 py-4 font-semibold">TOLL</th>
                  <th className="px-6 py-4 font-semibold">OTHER</th>
                  <th className="px-6 py-4 font-semibold">MAINT. (LINKED)</th>
                  <th className="px-6 py-4 font-semibold">TOTAL</th>
                  <th className="px-6 py-4 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading && otherExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground animate-pulse">Loading other expenses...</td>
                  </tr>
                ) : otherExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No other expenses found.</td>
                  </tr>
                ) : otherExpenses.map((expense) => {
                  const total = (expense.toll || 0) + (expense.other || 0) + (expense.maintLinked || 0);
                  return (
                    <tr key={expense._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-muted-foreground text-xs">{expense.trip?.tripId || '-'}</td>
                      <td className="px-6 py-4 font-mono font-medium text-primary/80">{expense.vehicle?.regNumber || '-'}</td>
                      <td className="px-6 py-4">${expense.toll?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4">${expense.other?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4">${expense.maintLinked?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4 font-medium">${total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-sm ${
                          expense.status === 'Available' || expense.status === 'Completed' ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {expense.status || 'Logged'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-border/50 rounded-xl mt-8 bg-card/30 backdrop-blur-sm gap-4">
        <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
          TOTAL OPERATIONAL COST
          <div className="text-[10px] font-normal mt-1">(FUEL + MAINT + TOLL + OTHER)</div>
        </div>
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#ffb86c]">
          ${summary?.grandTotal?.toLocaleString() || '0'}
        </div>
      </div>
    </div>
  );
}

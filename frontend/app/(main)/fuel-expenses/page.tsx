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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold opacity-0">Fuel & Expenses</h2>
        <div className="flex gap-4">
          <Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white">
            <Plus className="mr-2 h-4 w-4" /> Log Fuel
          </Button>
          <Button className="bg-[#c2843b] hover:bg-[#b4752c] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">FUEL LOGS</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">VEHICLE</th>
                <th className="px-6 py-4 font-medium">DATE</th>
                <th className="px-6 py-4 font-medium">LITERS</th>
                <th className="px-6 py-4 font-medium">FUEL COST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && fuelLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading fuel logs...</td>
                </tr>
              ) : fuelLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No fuel logs found.</td>
                </tr>
              ) : fuelLogs.map((log) => (
                <tr key={log._id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono">{log.vehicle?.regNumber || 'Unknown'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(log.date)}</td>
                  <td className="px-6 py-4">{log.liters} L</td>
                  <td className="px-6 py-4">{log.cost?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">OTHER EXPENSES (TOLL / MISC)</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">TRIP</th>
                <th className="px-6 py-4 font-medium">VEHICLE</th>
                <th className="px-6 py-4 font-medium">TOLL</th>
                <th className="px-6 py-4 font-medium">OTHER</th>
                <th className="px-6 py-4 font-medium">MAINT. (LINKED)</th>
                <th className="px-6 py-4 font-medium">TOTAL</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && otherExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading other expenses...</td>
                </tr>
              ) : otherExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No other expenses found.</td>
                </tr>
              ) : otherExpenses.map((expense) => {
                const total = (expense.toll || 0) + (expense.other || 0) + (expense.maintLinked || 0);
                return (
                  <tr key={expense._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground">{expense.trip?.tripId || '-'}</td>
                    <td className="px-6 py-4 font-mono">{expense.vehicle?.regNumber || '-'}</td>
                    <td className="px-6 py-4">{expense.toll?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4">{expense.other?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4">{expense.maintLinked?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 font-medium">{total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-medium text-black ${
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

      <div className="flex justify-between items-center py-4 border-t border-border mt-8">
        <div className="text-sm font-medium tracking-wide">
          TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT + TOLL + OTHER
        </div>
        <div className="text-2xl font-bold text-[#c2843b]">
          {summary?.grandTotal?.toLocaleString() || '0'}
        </div>
      </div>
    </div>
  );
}

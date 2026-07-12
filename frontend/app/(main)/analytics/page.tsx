"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchReportsAnalytics } from "@/store/slices/analyticsSlice";

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { reports, loading } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchReportsAnalytics());
  }, [dispatch]);

  const kpiData = reports?.kpis;
  const kpis = [
    { label: "FUEL EFFICIENCY", value: `${kpiData?.fuelEfficiency || 0} km/l`, color: "border-t-blue-500" },
    { label: "FLEET UTILIZATION", value: `${kpiData?.fleetUtilization || 0}%`, color: "border-t-green-500" },
    { label: "OPERATIONAL COST", value: (kpiData?.operationalCost || 0).toLocaleString(), color: "border-t-[#c2843b]" },
    { label: "VEHICLE ROI", value: `${kpiData?.vehicleRoi || 0}%`, color: "border-t-green-500" },
  ];

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = reports?.monthlyRevenue || [];
  const maxRev = Math.max(...revenueData, 1);
  const monthlyRevenue = revenueData.map((val, i) => ({
    month: monthLabels[i],
    height: `${Math.round((val / maxRev) * 100)}%`
  })).slice(0, 7); // Just showing first 7 months as in wireframe

  const topVehicles = reports?.topCostliestVehicles || [];
  const maxCost = Math.max(...topVehicles.map(v => v.totalCost), 1);
  const colors = ["bg-red-400", "bg-[#c2843b]", "bg-blue-400", "bg-gray-400"];
  
  const topCostliest = topVehicles.map((v, i) => ({
    vehicle: v.modelName,
    percentage: Math.round((v.totalCost / maxCost) * 100),
    color: colors[i % colors.length]
  }));

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-sm text-muted-foreground animate-pulse p-4 rounded-lg bg-card/50 border border-border/50">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <Card key={i} className={`bg-card/50 backdrop-blur-sm border-border/50 rounded-xl border-t-4 ${kpi.color} shadow-sm hover:shadow-lg transition-all hover:-translate-y-1`}>
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-muted-foreground tracking-wider mb-2 uppercase relative z-10">{kpi.label}</div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70 relative z-10">{kpi.value}</div>
                  <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${kpi.color.replace('border-t-', 'bg-')} z-0`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
            <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-8">MONTHLY REVENUE</h3>
              <div className="h-64 flex items-end gap-2 border-b border-border/50 pb-2 px-2">
                {monthlyRevenue.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-all rounded-t-md shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] relative"
                      style={{ height: data.height }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10">
                        {data.height}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium text-center mt-3 group-hover:text-primary transition-colors">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-8">TOP COSTLIEST VEHICLES</h3>
              <div className="space-y-6">
                {topCostliest.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-24 text-sm font-mono text-muted-foreground group-hover:text-white transition-colors">{item.vehicle}</div>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${item.color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {topCostliest.length === 0 && (
                  <div className="text-sm text-muted-foreground flex items-center justify-center h-40 border border-dashed border-border/50 rounded-lg">No data available</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

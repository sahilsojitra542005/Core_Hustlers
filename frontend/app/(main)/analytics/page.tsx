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
        <div className="text-sm text-muted-foreground">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <Card key={i} className={`bg-transparent border-border rounded-lg border-t-4 ${kpi.color}`}>
                <CardContent className="p-6">
                  <div className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2 uppercase">{kpi.label}</div>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">MONTHLY REVENUE</h3>
              <div className="h-64 flex items-end gap-2 border-b border-border pb-2 px-2">
                {monthlyRevenue.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                    <div 
                      className="w-full bg-blue-500/80 hover:bg-blue-400 transition-colors rounded-t-sm"
                      style={{ height: data.height }}
                    ></div>
                    <div className="text-[10px] text-muted-foreground text-center mt-2">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-6">TOP COSTLIEST VEHICLES</h3>
              <div className="space-y-6">
                {topCostliest.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-mono text-muted-foreground">{item.vehicle}</div>
                    <div className="flex-1 h-4 bg-secondary rounded-sm overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {topCostliest.length === 0 && (
                  <div className="text-sm text-muted-foreground">No data available</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

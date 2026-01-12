"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface MonthlyPerformanceWidgetProps {
  stats: any;
  className?: string;
}

export default function MonthlyPerformanceWidget({
  stats,
  className = "",
}: MonthlyPerformanceWidgetProps) {
  // Mock data for immediate visualization if no stats exist
  const mockMonthlyData = [
    { month: "January", pnl: 1250 },
    { month: "February", pnl: -450 },
    { month: "March", pnl: 890 },
    { month: "April", pnl: 2100 },
    { month: "May", pnl: -120 },
    { month: "June", pnl: 1560 },
  ];

  const chartData = (stats?.monthlyData && stats.monthlyData.length > 0) ? stats.monthlyData : mockMonthlyData;
  
  // Calculate trend
  const lastMonth = chartData[chartData.length - 1]?.pnl || 0;
  const prevMonth = chartData[chartData.length - 2]?.pnl || 0;
  const trend = lastMonth - prevMonth;
  const isTrendingUp = trend >= 0;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header Section mimicking CardHeader */}
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase">Monthly Performance</h3>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                 Jan - Dec {new Date().getFullYear()}
                </p>
            </div>
             {/* Dynamic Trend Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isTrendingUp 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}>
              {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-xs font-black tabular-nums">
                {trend > 0 ? "+" : ""}{trend.toFixed(2)}
              </span>
            </div>
        </div>
      </div>

      {/* Content Section mimicking CardContent */}
      <div className="w-full h-[300px] p-2 relative">
        {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0, 
                  right: 20,
                  top: 20,
                  bottom: 20
                }}
              >
                 <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="pnl" hide />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(value) => value.slice(0, 3).toUpperCase()}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                          <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">{label}</p>
                          <p className={`text-base font-black tabular-nums ${
                             Number(payload[0].value) >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}>
                            ${Number(payload[0].value).toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="pnl" radius={4} barSize={32}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"} 
                        fillOpacity={0.8}
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40 space-y-4">
               <div className="p-4 rounded-full bg-foreground/5 border border-foreground/10">
                   <TrendingUp size={24} className="opacity-50" />
               </div>
               <p className="text-xs font-mono uppercase tracking-widest">No performance data recorded</p>
            </div>
        )}
      </div>

      {/* Footer Section mimicking CardFooter */}
      <div className="flex flex-col items-start gap-2 text-sm p-6 pt-0">
        <div className="flex gap-2 leading-none font-medium text-foreground/60">
          Showing net profit/loss distribution
        </div>
      </div>
    </div>
  );
}

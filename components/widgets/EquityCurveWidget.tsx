"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { Activity, TrendingUp, Wallet } from "lucide-react";

interface EquityCurveWidgetProps {
  stats: any;
  className?: string;
}

export default function EquityCurveWidget({
  stats,
  className = "",
}: EquityCurveWidgetProps) {
  
  // Default Starting Balance (Standard Prop Firm Challenge Amount)
  const startingBalance = stats?.startingBalance || 100000;

  // Transform real data or use Mock Data
  // We convert relative P&L to Absolute Equity (Balance + Floats)
  let data = [];
  if (stats?.equityCurve && stats.equityCurve.length > 0) {
     const firstVal = stats.equityCurve[0].value;
     // Heuristic: If the value is large (e.g. > 1000), assume it's already Absolute Equity
     // If it's small, it's likely P&L that needs startingBalance added
     const isAbsolute = Math.abs(firstVal) > 10000 || Math.abs(firstVal - startingBalance) < startingBalance * 0.5;

     data = stats.equityCurve.map((d: any) => ({
       name: d.name,
       pnl: isAbsolute ? d.value - startingBalance : d.value,
       equity: isAbsolute ? d.value : startingBalance + d.value
     }));
  } else {
     // Comprehensive Mock Data showing P&L swings
     const mockPnl = [
      { name: 'Jan', pnl: 4000 },
      { name: 'Feb', pnl: 3000 }, // Drawdown starts
      { name: 'Mar', pnl: -1000 }, // Below initial balance
      { name: 'Apr', pnl: 500 },
      { name: 'May', pnl: -2000 },
      { name: 'Jun', pnl: -250 },
      { name: 'Jul', pnl: 3490 }, // Recovery
      { name: 'Aug', pnl: 4500 }, // Profit
      { name: 'Sep', pnl: 2100 },
    ];
    data = mockPnl.map(d => ({
        ...d,
        equity: startingBalance + d.pnl
    }));
  }

  // Calculate Gradient Offset based on Starting Balance
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i: any) => i.equity));
    const dataMin = Math.min(...data.map((i: any) => i.equity));

    if (dataMax <= startingBalance) return 0;
    if (dataMin >= startingBalance) return 1;

    return (dataMax - startingBalance) / (dataMax - dataMin);
  };

  const off = gradientOffset();
  
  // Current Metrics
  const totalNetPnL = stats?.totalPnl !== undefined ? stats.totalPnl : data[data.length - 1].pnl;
  const currentBalance = startingBalance + totalNetPnL;

  // Calculate Domain to ensure Starting Balance is always centered
  const equityValues = data.map((d: any) => d.equity);
  const minEquity = Math.min(...equityValues);
  const maxEquity = Math.max(...equityValues);
  
  // Find the greatest distance from baseline (up or down)
  const maxDeviation = Math.max(
    Math.abs(maxEquity - startingBalance),
    Math.abs(startingBalance - minEquity)
  );
  
  // Add 20% padding, or default to 1% of balance if perfectly flat
  const padding = maxDeviation > 0 ? maxDeviation * 0.2 : startingBalance * 0.01;
  const yDomain = [startingBalance - maxDeviation - padding, startingBalance + maxDeviation + padding];

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-6 border-b border-border pb-6">
        <div>
          <h3 className="text-2xl font-black text-foreground dark:text-foreground tracking-tight uppercase italic">
            Equity Curve
          </h3>
          <p className="text-[11px] text-foreground/60 dark:text-muted-foreground font-mono uppercase tracking-[0.2em] mt-1">
            Account Growth
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[10px] font-black text-foreground/60 dark:text-muted-foreground uppercase tracking-[0.2em] mb-1">
              <span>Total Balance</span>
              <Wallet size={12} className={currentBalance >= startingBalance ? "text-emerald-500" : "text-amber-500"} />
            </div>
            <div className="text-2xl font-black tabular-nums text-foreground">
               ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
             <div className={`text-[10px] font-bold font-mono text-right ${totalNetPnL >= 0 ? "text-emerald-500" : "text-red-500"}`}>
               {totalNetPnL >= 0 ? "+" : ""}{((totalNetPnL / startingBalance) * 100).toFixed(2)}% (${totalNetPnL.toLocaleString()})
             </div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#10b981" stopOpacity={0.7} />
                  <stop offset={off} stopColor="#10b981" stopOpacity={0.05} />
                  <stop offset={off} stopColor="#ef4444" stopOpacity={0.05} />
                  <stop offset="1" stopColor="#ef4444" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.1)"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                width={40}
                domain={yDomain}
                allowDataOverflow={true}
              />
              <Tooltip 
                cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const equity = Number(payload[0].value);
                    const pnl = equity - startingBalance;
                    return (
                      <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">{label}</p>
                        <p className="text-lg font-black tabular-nums text-white">
                          ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs font-mono font-bold ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                           {pnl >= 0 ? "+" : ""}${pnl.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={startingBalance} stroke="rgba(255,255,255,0.5)" strokeDasharray="3 3" label={{ value: "BASELINE", fill: "rgba(255,255,255,0.3)", fontSize: 10, position: "insideBottomRight" }} />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="#000" 
                fill="url(#splitColor)" 
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
              />
              {/* Overlay Line for Coloring */}
               <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="url(#splitColorStoke)" 
                fill="none" 
                strokeWidth={3}
              />
               <defs>
                <linearGradient id="splitColorStoke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#10b981" stopOpacity={1} />
                  <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}
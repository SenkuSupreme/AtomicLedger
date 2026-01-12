"use client";

import React from "react";
import { Award, TrendingUp } from "lucide-react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface SetupQualityWidgetProps {
  stats: any;
  className?: string;
}

export default function SetupQualityWidget({
  stats,
  className = "",
}: SetupQualityWidgetProps) {
  
  // Transform real data or use Mock Data for visualization
  let chartData = [];
  
  if (stats?.gradeBreakdown && Object.keys(stats.gradeBreakdown).length > 0) {
      const gradeOrder = { "A+": 5, "A": 4, "B": 3, "C": 2, "D": 1 };
      chartData = Object.entries(stats.gradeBreakdown)
        .sort(([a], [b]) => (gradeOrder[b as keyof typeof gradeOrder] || 0) - (gradeOrder[a as keyof typeof gradeOrder] || 0))
        .map(([grade, data]: [string, any]) => ({
          grade,
          pnl: data.avgPnl,
          winRate: (data.winCount / data.count) * 100,
          count: data.count
        }));
  } else {
      // Mock Fallback
      chartData = [
          { grade: "A+", winRate: 85, pnl: 1200, count: 12 },
          { grade: "A", winRate: 68, pnl: 850, count: 24 },
          { grade: "B", winRate: 52, pnl: 120, count: 18 },
          { grade: "C", winRate: 38, pnl: -240, count: 9 },
          { grade: "D", winRate: 15, pnl: -600, count: 5 }
      ];
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 dark:text-muted-foreground">Grade Analysis</span>
           </div>
           <div className="flex flex-col">
              <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase">Setup Quality</h3>
               <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                 Performance by Grade
                </p>
           </div>
        </div>
        <div className="p-3 bg-foreground/5 rounded-2xl border border-border text-yellow-500/80">
          <Award size={20} />
        </div>
      </div>

      <div className="w-full h-[300px] relative">
         <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="grade" 
              scale="band" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
               yAxisId="left"
               orientation="left"
               tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
               tickLine={false}
               axisLine={false}
               tickFormatter={(val) => `${val}%`}
            />
            <YAxis 
               yAxisId="right"
               orientation="right"
               tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
               tickLine={false}
               axisLine={false}
               tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Grade {label}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-yellow-500 flex justify-between gap-4">
                           <span>Win Rate:</span>
                           <span className="font-mono">{Number(payload[0].value).toFixed(1)}%</span>
                        </p>
                        <p className="text-sm font-bold text-emerald-400 flex justify-between gap-4">
                           <span>Avg P&L:</span>
                           <span className="font-mono">${Number(payload[1].value).toFixed(2)}</span>
                        </p>
                        <p className="text-xs text-white/40 border-t border-white/10 pt-1 mt-1 text-right">
                           {(payload[0].payload as any).count} Trades
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar yAxisId="left" dataKey="winRate" barSize={32} radius={[4, 4, 0, 0]}>
               {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="rgba(234, 179, 8, 0.8)" />
               ))}
            </Bar>
            <Line 
               yAxisId="right"
               type="monotone" 
               dataKey="pnl" 
               stroke="#10b981" 
               strokeWidth={3}
               dot={{ fill: "#000", stroke: "#10b981", strokeWidth: 2, r: 4 }}
               activeDot={{ r: 6, fill: "#fff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
       <div className="flex items-center gap-4 text-xs font-medium text-foreground/60 px-2">
         <div className="flex items-center gap-1.5">
           <div className="w-2 h-2 rounded-sm bg-yellow-500/80" />
           <span>Win Rate</span>
         </div>
         <div className="flex items-center gap-1.5">
           <div className="w-2 h-2 rounded-full border-2 border-emerald-500" />
           <span>Profitability</span>
         </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import CalendarHeatmap from "@/components/CalendarHeatmap";

interface ActivityMapWidgetProps {
  stats: any;
  className?: string;
}

export default function ActivityMapWidget({
  stats,
  className = "",
}: ActivityMapWidgetProps) {
  return (
    <div className={`h-full ${className}`}>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Activity Map
          </h3>
          <p className="text-[11px] text-white/50 font-mono uppercase tracking-[0.3em]">
            Time & Performance Analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Heatmap Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-white/20 rounded-full" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
              Performance Heatmap
            </span>
          </div>
          <div className="min-h-[160px]">
            {stats?.heatmap && stats.heatmap.length > 0 ? (
              <CalendarHeatmap data={stats.heatmap} />
            ) : (
              <div className="flex items-center justify-center h-40 bg-white/5 border border-white/5 rounded-xl text-white/30 text-xs font-mono">
                NO TRADING ACTIVITY RECORDED
              </div>
            )}
          </div>
        </div>

        {/* Distribution Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-white/20 rounded-full" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
              Trade Distribution
            </span>
          </div>
          
          <div className="space-y-4">
            {stats?.distribution && stats.distribution.length > 0 ? (
              stats.distribution.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-white/80">{item.name}</span>
                    <span className="text-white/40">{item.count} trades ({item.percentage}%)</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/40 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Waiting for data...</p>
              </div>
            )}
          </div>

          {stats?.summary && (
            <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Most Active</p>
                <p className="text-sm font-bold text-white">{stats.summary.mostActive || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Impact</p>
                <p className={`text-sm font-bold ${stats.summary.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.summary.totalPnL >= 0 ? '+' : ''}${Math.abs(stats.summary.totalPnL).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

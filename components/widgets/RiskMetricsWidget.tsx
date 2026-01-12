"use client";

import React from "react";
import { Shield } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface RiskMetricsWidgetProps {
  stats: any;
  className?: string;
}

export default function RiskMetricsWidget({
  stats,
  className = "",
}: RiskMetricsWidgetProps) {
  
  // Ensure we always have valid numbers for the chart to render
  const safeStats = stats || {};

  const data = [
    {
      subject: "Drawdown",
      // Inverse: Lower drawdown is better. Default to 80 (Safety score)
      A: safeStats.maxDrawdown ? Math.max(0, 100 - (safeStats.maxDrawdown / 1000) * 10) : 80, 
      fullMark: 100,
    },
    {
      subject: "Win Rate",
      A: typeof safeStats.winRate === 'number' ? safeStats.winRate : 60, // Default visual baseline
      fullMark: 100,
    },
    {
      subject: "Risk Ratio",
      // e.g. 1.5 RR -> ~50 score
      A: typeof safeStats.profitFactor === 'number' ? Math.min(100, safeStats.profitFactor * 33) : 55, 
      fullMark: 100,
    },
    {
      subject: "Exposure",
      A: 85, // Static baseline for discipline
      fullMark: 100,
    },
    {
      subject: "Factor",
      A: typeof safeStats.profitFactor === 'number' ? Math.min(100, safeStats.profitFactor * 25) : 50,
      fullMark: 100,
    },
    {
      subject: "Discipline",
      A: 90, // Static baseline for plan adherence
      fullMark: 100,
    },
  ];

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 dark:text-muted-foreground">Risk Profile</span>
          </div>
          <h3 className="text-2xl font-black text-foreground dark:text-foreground italic tracking-tighter uppercase">Risk Radar</h3>
        </div>
        <div className="p-3 bg-foreground/5 rounded-2xl border border-border text-red-500/80">
          <Shield size={20} />
        </div>
      </div>

      <div className="w-full h-[300px] relative">
        <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full" />
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Portfolio"
              dataKey="A"
              stroke="#10b981"
              strokeWidth={2}
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

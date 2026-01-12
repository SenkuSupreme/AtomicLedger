"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Crosshair,
} from "lucide-react";

interface MetricWidgetProps {
  widget: any;
  stats: any;
  className?: string;
}

const ICON_MAP = {
  DollarSign: DollarSign,
  Target: Target,
  Activity: Activity,
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
  BarChart2: BarChart2,
  Crosshair: Crosshair,
};

const METRIC_CONFIG = {
  totalPnl: {
    label: "Total P&L",
    getValue: (stats: any) => `$${(stats?.totalPnl || 0).toFixed(2)}`,
    getSubValue: (stats: any) => {
      const pnl = stats?.totalPnl || 0;
      const trades = stats?.totalTrades || 0;
      return trades > 0 ? `${(pnl / trades).toFixed(2)} avg per trade` : "No trades in period";
    },
    getTrend: (stats: any) => (stats?.totalPnl >= 0 ? "up" : "down"),
  },
  winRate: {
    label: "Win Rate",
    getValue: (stats: any) => `${stats?.winRate || "0.0"}%`,
    getSubValue: (stats: any) => `${stats?.wins || 0}W - ${stats?.losses || 0}L`,
    getTrend: (stats: any) => (parseFloat(stats?.winRate) >= 50 ? "up" : "down"),
  },
  profitFactor: {
    label: "Profit Factor",
    getValue: (stats: any) => (stats?.profitFactor || 0).toFixed(2),
    getSubValue: (stats: any) => (stats?.profitFactor >= 2 ? "High Performance" : stats?.profitFactor >= 1 ? "Profitable" : "Unprofitable"),
    getTrend: (stats: any) =>
      parseFloat(stats?.profitFactor) >= 1.5 ? "up" : stats?.profitFactor >= 1.0 ? "neutral" : "down",
  },
  expectancy: {
    label: "Expectancy",
    getValue: (stats: any) => `$${(stats?.expectancy || 0).toFixed(2)}`,
    getSubValue: () => "Per Trade Edge",
    getTrend: (stats: any) =>
      parseFloat(stats?.expectancy) > 0 ? "up" : "down",
  },
  averageR: {
    label: "Avg R-Multiple",
    getValue: (stats: any) => `${(stats?.averageR || 0).toFixed(2)}R`,
    getSubValue: () => "Reward/Risk Ratio",
    getTrend: (stats: any) =>
      parseFloat(stats?.averageR) >= 2 ? "up" : stats?.averageR >= 1 ? "neutral" : "down",
  },
  maxDrawdown: {
    label: "Max Drawdown",
    getValue: (stats: any) => `$${(stats?.maxDrawdown || 0).toFixed(2)}`,
    getSubValue: (stats: any) => stats?.maxDrawdownPercent ? `${stats.maxDrawdownPercent}% profile impact` : "Minimal Risk",
    getTrend: () => "down",
  },
  totalTrades: {
    label: "Total Trades",
    getValue: (stats: any) => stats?.totalTrades || 0,
    getSubValue: (stats: any) => `${stats?.breakevens || 0} neutral exits`,
    getTrend: () => "neutral",
  },
  accountBalance: {
    label: "Account Balance",
    getValue: (stats: any) => `$${(stats?.currentBalance || stats?.balance || 0).toFixed(2)}`,
    getSubValue: (stats: any) => {
      const pnl = stats?.allTimePnl || 0;
      const initial = stats?.initialBalance || 0;
      const percent = initial > 0 ? (pnl / initial) * 100 : 0;
      return `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)} (${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%)`;
    },
    getTrend: (stats: any) => {
      const pnl = stats?.allTimePnl || 0;
      return pnl >= 0 ? "up" : "down";
    },
  },
};

export default function MetricWidget({
  widget,
  stats,
  className = "",
}: MetricWidgetProps) {
  const metricKey = widget.config?.metric || "totalPnl";
  const iconKey = widget.config?.icon || "DollarSign";

  const config = METRIC_CONFIG[metricKey as keyof typeof METRIC_CONFIG];
  const IconComponent =
    ICON_MAP[iconKey as keyof typeof ICON_MAP] || DollarSign;

  if (!config) {
    return (
      <div
        className={`flex items-center justify-center h-32 text-foreground/60 dark:text-muted-foreground ${className}`}
      >
        Invalid metric configuration
      </div>
    );
  }

  const value = config.getValue(stats);
  const subValue = config.getSubValue(stats);
  const trend = config.getTrend(stats);

  return (
    <div className={`h-full p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] relative overflow-hidden group ${className}`}>
      {/* Icon Watermark */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <IconComponent size={48} className="text-white" />
      </div>

      {/* Trend Indicator */}
      <div className="absolute top-4 left-4">
        {trend === "up" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ArrowUpRight size={12} className="text-emerald-500" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-500">Positive</span>
          </div>
        )}
        {trend === "down" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <ArrowDownRight size={12} className="text-red-500" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-red-500">Negative</span>
          </div>
        )}
        {trend === "neutral" && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/10 border border-gray-500/20">
            <Activity size={12} className="text-gray-400" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">Neutral</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 pt-12">
        <div className="text-gray-400 mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">
          {config.label}
        </div>
        
        <div className={`text-4xl font-black tracking-tight mb-2 tabular-nums ${
          trend === "up"
            ? "text-emerald-400"
            : trend === "down"
            ? "text-red-400"
            : "text-white"
        }`}>
          {value}
        </div>

        <div className="text-[10px] text-gray-500 font-mono">
          {subValue}
        </div>
      </div>
    </div>
  );
}

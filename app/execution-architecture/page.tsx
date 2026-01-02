"use client";

import React, { useState, useEffect } from "react";
import { Zap, TrendingUp, Target, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolios } from "@/context/PortfolioContext";
import PortfolioSelector from "@/components/PortfolioSelector";
import { calculateTradeMetrics } from "@/lib/utils/tradeCalculations";

interface Trade {
  _id: string;
  symbol: string;
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  fees?: number;
  assetType?: string;
  direction?: "long" | "short";
  executionArchitecture?: string;
  tradeType?: string;
  timestampEntry: string;
  pnl?: number;
  status: string;
}

interface ArchStats {
  id: string;
  label: string;
  count: number;
  wins: number;
  losses: number;
  breakeven: number;
  totalPnL: number;
  grossProfit: number;
  grossLoss: number;
  winRate: number;
  profitFactor: number;
  avgPnL: number;
  avgWin: number;
  avgLoss: number;
  maxWin: number;
  maxLoss: number;
  expectancy: number;
}

const initialArchStats = (id: string, label: string): ArchStats => ({
  id,
  label,
  count: 0,
  wins: 0,
  losses: 0,
  breakeven: 0,
  totalPnL: 0,
  grossProfit: 0,
  grossLoss: 0,
  winRate: 0,
  profitFactor: 0,
  avgPnL: 0,
  avgWin: 0,
  avgLoss: 0,
  maxWin: 0,
  maxLoss: 0,
  expectancy: 0,
});

function updateArchStats(stats: ArchStats, pnl: number) {
  stats.count++;
  stats.totalPnL += pnl;
  if (pnl > 0) {
    stats.wins++;
    stats.grossProfit += pnl;
    stats.maxWin = Math.max(stats.maxWin, pnl);
  } else if (pnl < 0) {
    stats.losses++;
    stats.grossLoss += Math.abs(pnl);
    stats.maxLoss = Math.min(stats.maxLoss, pnl);
  } else {
    stats.breakeven++;
  }
  stats.winRate = stats.count > 0 ? Math.round((stats.wins / stats.count) * 100) : 0;
  stats.profitFactor = stats.grossLoss > 0 ? Number((stats.grossProfit / stats.grossLoss).toFixed(2)) : stats.grossProfit > 0 ? 100 : 0;
  stats.avgPnL = stats.count > 0 ? stats.totalPnL / stats.count : 0;
  stats.avgWin = stats.wins > 0 ? stats.grossProfit / stats.wins : 0;
  stats.avgLoss = stats.losses > 0 ? stats.grossLoss / stats.losses : 0;
  const winPct = stats.count > 0 ? stats.wins / stats.count : 0;
  const lossPct = stats.count > 0 ? stats.losses / stats.count : 0;
  stats.expectancy = (winPct * stats.avgWin) - (lossPct * stats.avgLoss);
}

function getCalculatedPnL(trade: Trade): number {
  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    try {
      const metrics = calculateTradeMetrics({
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        stopLoss: 0,
        takeProfit: 0,
        quantity: trade.quantity,
        direction: trade.direction || "long",
        portfolioBalance: 10000,
        fees: trade.fees || 0,
        assetType: trade.assetType || "forex",
        symbol: trade.symbol || "",
      });
      return metrics.netPnl;
    } catch (e) {
      console.error("Calc PnL error", e);
    }
  }
  return Number(trade.pnl) || 0;
}

export default function ExecutionArchitecturePage() {
  const { selectedPortfolioId, setSelectedPortfolioId } = usePortfolios();
  const [archData, setArchData] = useState<Record<string, ArchStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "1000" });
      if (selectedPortfolioId && selectedPortfolioId !== "all") {
        params.append("portfolioId", selectedPortfolioId);
      }
      const res = await fetch(`/api/trades?${params}`);
      const { trades } = await res.json();

      const archs: Record<string, ArchStats> = {};

      trades.forEach((t: Trade) => {
        if (t.status !== "Closed") return;
        let arch = t.executionArchitecture;
        // Fallback to tradeType if executionArchitecture is missing
        if (!arch && t.tradeType) {
          arch = t.tradeType;
        }
        if (!arch) arch = "Unspecified";
        if (!archs[arch]) {
          archs[arch] = initialArchStats(arch, arch);
        }
        const pnl = getCalculatedPnL(t);
        updateArchStats(archs[arch], pnl);
      });

      setArchData(archs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPortfolioId]);

  const archArray = Object.values(archData).sort((a, b) => b.count - a.count);

  return (
    <div className="relative min-h-screen pb-20 font-sans text-white">
      {/* Institutional Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-violet-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1200px] h-[1200px] bg-fuchsia-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Full Width Elite Header */}
      <div className="px-12 py-10 border-b border-white/5 bg-[#050505]/40 mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
                  <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-violet-400 italic">Core Engine</span>
               </div>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Module: Execution Logic</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
              Execution <span className="text-white/10 font-thin not-italic">Architecture</span>
            </h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] italic">
              "Structural audit of order flow delivery and systemic execution efficiency."
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-6 py-2 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 shadow-inner">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Global P&L</span>
                  <span className={`text-lg font-black italic ${archArray.reduce((sum, a) => sum + a.totalPnL, 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${archArray.reduce((sum, a) => sum + a.totalPnL, 0).toFixed(2)}
                  </span>
               </div>
               <div className="h-8 w-px bg-white/5" />
               <PortfolioSelector
                 currentId={selectedPortfolioId}
                 onSelect={setSelectedPortfolioId}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 space-y-12">

      {/* Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
        {archArray.map((arch, idx) => {
          const isPositive = arch.totalPnL >= 0;
          const pnlColor = isPositive ? "text-emerald-400" : "text-rose-400";
          const borderColor = isPositive ? "border-emerald-500/10" : "border-rose-500/10";
          const bgColor = isPositive ? "bg-emerald-500/5" : "bg-rose-500/5";

          return (
            <motion.div
              key={arch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`${bgColor} ${borderColor} border rounded-[2.5rem] p-8 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight">{arch.label}</h3>
                  <span className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">{arch.count} Trades</span>
                </div>
                <Target size={20} className={isPositive ? "text-emerald-400/50" : "text-rose-400/50"} />
              </div>

              {/* Net P&L */}
              <div className="mb-6">
                <span className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">Net P&L</span>
                <div className={`text-4xl font-black italic ${pnlColor}`}>${arch.totalPnL.toFixed(2)}</div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-background/40 rounded-2xl border border-border/50">
                  <span className="text-[8px] font-black uppercase text-muted-foreground/50 block mb-1">Win Rate</span>
                  <div className={`text-2xl font-black italic ${arch.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{arch.winRate}%</div>
                </div>
                <div className="p-3 bg-background/40 rounded-2xl border border-border/50">
                  <span className="text-[8px] font-black uppercase text-muted-foreground/50 block mb-1">Expectancy</span>
                  <div className={`text-2xl font-black italic ${arch.expectancy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${arch.expectancy.toFixed(2)}</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="space-y-2 text-xs border-t border-border/50 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60 font-medium">Profit Factor</span>
                  <span className="font-black">{arch.profitFactor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60 font-medium">Avg Win</span>
                  <span className="font-black text-emerald-400">${arch.avgWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60 font-medium">Avg Loss</span>
                  <span className="font-black text-rose-400">${arch.avgLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60 font-medium">Max Win</span>
                  <span className="font-black text-emerald-400">${arch.maxWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground/60 font-medium">Max Loss</span>
                  <span className="font-black text-rose-400">${arch.maxLoss.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {archArray.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center">
            <AlertCircle size={48} className="text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-black text-muted-foreground/60 uppercase tracking-tight italic">No Execution Data</h3>
            <p className="text-sm text-muted-foreground/40 mt-2">Start logging trades with execution architecture tags.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  PlayCircle, 
  Activity, 
  Globe, 
  Database, 
  Cpu, 
  Shield, 
  Zap,
  Layers,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BacktesterPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trades?type=backtest")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data.trades || []);
        setLoading(false);
      });
  }, []);

  const totalPnL = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const winRate = trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Initializing Simulation Terminal...
      </div>
    );
  }

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-sky-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Simulation Terminal 02 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Cpu size={10} className="text-blue-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Edge Validation: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Simulation Matrix
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Validate history. Stress-test tactical systems in the simulated neural grid. Codify your edge through high-fidelity archival playback."
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <Link
            href="/backtester/new"
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Simulation</span>
          </Link>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { 
            icon: totalPnL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />, 
            label: "Simulated P&L", 
            value: `$${totalPnL.toFixed(2)}`, 
            color: totalPnL >= 0 ? "emerald" : "red" 
          },
          { icon: <Activity size={18} />, label: "Win Rate", value: `${winRate}%`, color: "sky" },
          { icon: <Database size={18} />, label: "Signals Logged", value: trades.length, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`p-3 bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-2xl text-${stat.color}-400 group-hover:bg-white group-hover:text-black transition-all`}>
                   {stat.icon}
                </div>
                <span className={`text-3xl font-black italic tracking-tighter transition-colors ${stat.color === "red" ? "text-red-400" : "text-white/80 group-hover:text-white"}`}>{stat.value}</span>
             </div>
             <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                {stat.label}
             </div>
          </div>
        ))}
      </div>

      {/* Simulation Log Mesh */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] overflow-hidden relative z-10 shadow-3xl group/ledger"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500">
                  <PlayCircle size={20} />
               </div>
               <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] italic">Simulation Log</h3>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">Archived Fragments</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl">
               <Shield size={14} className="text-white/20" />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Validation Encryption 02</span>
            </div>
        </div>
        
        {trades.length === 0 ? (
            <div className="p-40 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
                <Layers size={64} className="text-white/10 mx-auto mb-10 relative z-10" />
                <h3 className="text-3xl font-black text-white/20 uppercase tracking-tighter italic relative z-10">Sector Void</h3>
                <p className="text-[11px] font-black text-white/10 uppercase tracking-[0.5em] italic max-w-xs mx-auto leading-relaxed relative z-10">
                  "No simulation data detected. Stress-test your systems to populate the neural grid."
                </p>
                <Link
                   href="/backtester/new"
                   className="mt-12 group relative inline-flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 overflow-hidden border border-white/10 relative z-10"
                >
                  <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <Plus size={18} className="relative z-10" />
                  <span className="relative z-10">Start Simulation 01</span>
                </Link>
            </div>
        ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/[0.04] border-b border-white/5">
                      <th className="py-8 px-10 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Temporal Marker</th>
                      <th className="py-8 px-6 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Asset Segment</th>
                      <th className="py-8 px-6 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Operational Side</th>
                      <th className="py-8 px-10 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic text-right">Yield Artifact</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {trades.map((trade) => (
                        <tr key={trade._id} className="group/row hover:bg-white/[0.03] transition-all duration-500">
                             <td className="py-8 px-10">
                                <div className="flex items-center gap-4">
                                   <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 group-hover/row:bg-white/10 transition-all">
                                      <Zap size={16} className="text-white/20 group-hover/row:text-white/60" />
                                   </div>
                                   <div className="text-[12px] font-black text-white uppercase italic tracking-tighter tabular-nums">
                                      {new Date(trade.createdAt).toLocaleDateString()}
                                   </div>
                                </div>
                             </td>
                             <td className="py-8 px-6">
                                <h4 className="text-xl font-black text-white group-hover/row:text-blue-400 transition-colors uppercase italic tracking-tighter">{trade.symbol}</h4>
                             </td>
                             <td className="py-8 px-6">
                                <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${trade.direction === 'long' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                   {trade.direction.toUpperCase()} SIGNAL
                                </div>
                             </td>
                             <td className="py-8 px-10 text-right">
                                <div className={`text-2xl font-black italic tracking-tighter tabular-nums ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                   {trade.pnl >= 0 ? "+" : ""}${Math.abs(trade.pnl || 0).toFixed(2)}
                                </div>
                             </td>
                        </tr>
                    ))}
                </tbody>
                </table>
             </div>
        )}
      </motion.div>
    </div>
  );
}

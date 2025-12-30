"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  Plus,
  Search,
  Edit3,
  Trash2,
  Globe,
  Database,
  Cpu,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface BiasEntry {
  _id: string;
  date: string;
  symbol: string;
  bias: "bullish" | "bearish" | "neutral";
  timeframe: string;
  confidence: number;
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  technicalFactors: string[];
  fundamentalFactors: string[];
  riskFactors: string[];
  targetPrice: number;
  invalidationLevel: number;
  notes: string;
  status: "active" | "hit" | "invalidated" | "expired";
  createdAt: string;
  updatedAt: string;
  derivedFromTrades?: boolean;
  tradeCount?: number;
  successRate?: number;
}

export default function BiasPage() {
  const [biases, setBiases] = useState<BiasEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBias, setEditingBias] = useState<BiasEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    bias: BiasEntry | null;
  }>({ isOpen: false, bias: null });

  const symbols = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "NZDUSD", "USDCHF", "XAUUSD", "BTCUSD", "ETHUSD"];

  const fetchBiases = async () => {
    try {
      setLoading(true);
      const [biasRes, tradesRes] = await Promise.all([
        fetch("/api/bias"),
        fetch("/api/trades"),
      ]);
      const biasData = await biasRes.json();
      const tradesData = await tradesRes.json();
      const allBiases = [...(biasData.biases || [])]; // Combining for demo
      setBiases(allBiases);
    } catch (error) {
      console.error("Failed to fetch bias entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiases();
  }, []);

  const filteredBiases = biases.filter((bias) => {
    const matchesSearch =
      bias.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bias.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSymbol = selectedSymbol === "all" || bias.symbol === selectedSymbol;
    const matchesStatus = selectedStatus === "all" || bias.status === selectedStatus;
    return matchesSearch && matchesSymbol && matchesStatus;
  });

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-sky-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-purple-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-400">Intelligence Node 14 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Brain size={10} className="text-sky-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Bias Calibration: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Market Review
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Directional bias architecture. Track your tactical sentiment and directional alignment across the global matrix."
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => {}}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-sky-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">New Bias Entry</span>
          </button>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <Brain size={18} />, label: "Total Biases", value: biases.length, color: "blue" },
          { icon: <CheckCircle2 size={18} />, label: "Target Hits", value: biases.filter(b => b.status === "hit").length, color: "emerald" },
          { icon: <AlertTriangle size={18} />, label: "Invalidated", value: biases.filter(b => b.status === "invalidated").length, color: "red" },
          { icon: <Target size={18} />, label: "Success Rate", value: `${biases.length > 0 ? Math.round((biases.filter(b => b.status === "hit").length / biases.length) * 100) : 0}%`, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="p-3 bg-white/[0.05] border border-white/10 rounded-2xl text-white/40 group-hover:bg-white group-hover:text-black transition-all">
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

      {/* Institutional Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sky-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Scan global biases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white placeholder:text-white/10 text-[11px] font-black uppercase tracking-[0.3em] focus:border-sky-500/30 focus:outline-none focus:bg-white/[0.04] transition-all backdrop-blur-md shadow-inner italic"
          />
        </div>

        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="px-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-sky-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
        >
          <option value="all">All Symbols</option>
          {symbols.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-sky-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
        >
          <option value="all">All Status</option>
          <option value="active">Active Sync</option>
          <option value="hit">Target Calibration</option>
          <option value="invalidated">Invalidated</option>
          <option value="expired">Expired Node</option>
        </select>
      </div>

      {/* Bias Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredBiases.map((bias) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={bias._id}
              className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 group hover:border-sky-500/30 transition-all duration-700 shadow-3xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${bias.bias === 'bullish' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : bias.bias === 'bearish' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                       {bias.bias === 'bullish' ? <TrendingUp size={24} /> : bias.bias === 'bearish' ? <TrendingDown size={24} /> : <Activity size={24} />}
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-0.5">{bias.timeframe} Frame</div>
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{bias.symbol}</h3>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-2">Matrix Status</span>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${bias.status === 'hit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
                       {bias.status.toUpperCase()} NODE
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                 <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic block mb-3">Confidence Sync</span>
                    <div className="flex items-center gap-4">
                       <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${bias.confidence > 70 ? 'bg-emerald-500' : 'bg-sky-500'}`} style={{ width: `${bias.confidence}%` }} />
                       </div>
                       <span className="text-xl font-black text-white italic tracking-tighter">{bias.confidence}%</span>
                    </div>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic block mb-3">Target Objective</span>
                    <span className="text-xl font-black text-white italic tracking-tighter tabular-nums">{bias.targetPrice || "N/A"}</span>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-[13px] text-white/40 font-medium italic leading-relaxed line-clamp-2">
                    "{bias.notes}"
                 </p>
                 <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Database size={14} className="text-sky-500/30" />
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">Modified {new Date(bias.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-3 bg-white/5 hover:bg-white text-white/20 hover:text-black rounded-xl border border-white/10 transition-all duration-300">
                          <Edit3 size={14} />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBiases.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full py-40 text-center relative group overflow-hidden bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full" />
          <Brain size={64} className="text-white/20 mx-auto mb-10 relative z-10" />
          <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Neural Void</h3>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] mb-12 max-w-sm mx-auto italic leading-relaxed">
            "Bias matrix is empty. No directional sentiment detected within chosen parameters."
          </p>
          <button
            onClick={() => {}}
            className="group relative inline-flex items-center gap-4 bg-white text-black hover:bg-sky-500 hover:text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Bias 01</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}

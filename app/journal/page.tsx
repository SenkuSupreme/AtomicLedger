"use client";

import { useState } from "react";
import Link from "next/link";
import TradeList from "@/components/TradeList";
import { 
  Plus, 
  BookOpen, 
  History, 
  TrendingUp, 
  Activity, 
  Database,
  Search,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioSelector from "@/components/PortfolioSelector";
import DateRangePicker from "@/components/DateRangePicker";
import NewTradeDialog from "@/components/NewTradeDialog";
import { usePortfolios } from "@/context/PortfolioContext";

export default function JournalPage() {
  const { selectedPortfolioId, setSelectedPortfolioId } = usePortfolios();
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isNewTradeOpen, setIsNewTradeOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-purple-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Execution Log 09 active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <History size={10} className="text-blue-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Archival Sequence: Verified</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Operation Ledger
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Institutional archival of operational history and performance audits. Every entry is a forensic artifact of the strategic edge."
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(start, end) => setDateRange({ start, end })}
          />
          <PortfolioSelector
            currentId={selectedPortfolioId}
            onSelect={setSelectedPortfolioId}
          />
          <button
            onClick={() => setIsNewTradeOpen(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-blue-500/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Log Operation</span>
          </button>
        </div>
      </div>

      {/* Institutional Stats Mesh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <Activity size={18} />, label: "Total Operations", value: "Locked", color: "blue" },
          { icon: <TrendingUp size={18} />, label: "Alpha Expectancy", value: "Verified", color: "emerald" },
          { icon: <Database size={18} />, label: "Data Sovereignty", value: "Active", color: "purple" },
          { icon: <History size={18} />, label: "Audit Trails", value: "Encrypted", color: "orange" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="p-3 bg-white/[0.05] border border-white/10 rounded-2xl text-white/40 group-hover:text-white group-hover:border-white/20 transition-all">
                   {stat.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black italic tracking-tighter text-white/60 drop-shadow-2xl">{stat.value}</span>
                  <div className={`h-0.5 w-8 rounded-full mt-2 bg-gradient-to-r from-transparent to-${stat.color}-500/40`} />
                </div>
             </div>
             <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                {stat.label}
             </div>
          </div>
        ))}
      </div>

      {/* Main Ledger Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 shadow-3xl overflow-hidden group/ledger"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/ledger:bg-blue-500/[0.05] transition-all duration-700" />
        
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Archival Records</h2>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl text-white/30 text-[10px] font-black uppercase tracking-widest italic">
                    <Search size={14} className="opacity-40" />
                    <span>Search Sector...</span>
                 </div>
              </div>
            </div>

            <div className="min-h-[500px]">
              <TradeList
                key={refreshKey}
                initialPortfolioId={selectedPortfolioId}
                initialDateRange={dateRange}
              />
            </div>
        </div>
      </motion.div>

      <NewTradeDialog
        isOpen={isNewTradeOpen}
        onClose={() => setIsNewTradeOpen(false)}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}

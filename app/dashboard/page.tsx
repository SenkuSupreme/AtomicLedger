"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { 
  BarChart2, 
  PlusCircle, 
  Globe, 
  Zap, 
  Activity, 
  TrendingUp, 
  Plus,
  Layout,
  Layers,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioSelector from "@/components/PortfolioSelector";
import DateRangePicker from "@/components/DateRangePicker";
import CreatePortfolioModal from "@/components/CreatePortfolioModal";
import ForexSessionNavbar from "@/components/ForexSessionNavbar";
import WidgetSystem from "@/components/WidgetSystem";
import { QuickNotesWidget, EquityCurveWidget } from "@/components/widgets";
import { usePortfolios } from "@/context/PortfolioContext";

export default function Dashboard() {
  const { data: session } = useSession();
  const {
    portfolios,
    loading: portfoliosLoading,
    refreshPortfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
  } = usePortfolios();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  // Memoized fetcher for analytics stats
  const fetchStats = React.useCallback(
    async (id: string, range: { start: string; end: string }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          portfolioId: id,
          ...(range.start && { startDate: range.start }),
          ...(range.end && { endDate: range.end }),
        });

        const res = await fetch(`/api/analytics?${queryParams}`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sync data whenever filters change
  useEffect(() => {
    if (!portfoliosLoading && portfolios.length > 0) {
      fetchStats(selectedPortfolioId, dateRange);
    }
  }, [
    selectedPortfolioId,
    dateRange,
    portfoliosLoading,
    portfolios.length,
    fetchStats,
  ]);

  if (portfoliosLoading)
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/50 font-bold text-sm uppercase tracking-wider animate-pulse">
        Loading Dashboard...
      </div>
    );

  // Empty State View
  if (!portfoliosLoading && portfolios.length === 0) {
    return (
      <div className="min-h-screen space-y-12 text-white font-sans relative overflow-hidden px-4 md:px-8">
         {/* Background Mesh */}
         <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#050505]">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-purple-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-40">
          <div className="relative group text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
            <Layers size={64} className="text-white/40 mx-auto mb-8 relative z-10" />
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
              Welcome to Your Dashboard
            </h1>
            <p className="text-white/60 text-base mb-12 max-w-md mx-auto leading-relaxed">
              Create your first trading portfolio to begin tracking your performance, journaling trades, and analyzing your metrics.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center gap-3 bg-white text-black hover:bg-blue-600 hover:text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 mx-auto overflow-hidden"
            >
              <PlusCircle size={18} />
              <span>Create Portfolio</span>
            </button>
          </div>
        </div>

        <CreatePortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newPortfolio) => {
            refreshPortfolios();
            setSelectedPortfolioId(newPortfolio._id);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8 bg-[#050505]">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-black -z-20" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8 pt-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">System Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Globe size={10} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Market Data Live</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
             Trading Dashboard
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Real-time performance metrics and active session monitoring. Maintain operational discipline."
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
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-blue-500/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={16} className="relative z-10" />
            <span className="relative z-10">New Portfolio</span>
          </button>
        </div>
      </div>

      {/* Progress Overlay */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 z-[200]">
          <div className="h-full bg-blue-500 animate-progress origin-left shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
        </div>
      )}

      {/* Main Analysis Section */}
      <div className="space-y-8 relative z-10">
        
        {/* Row 1: Sessions & Quick Notes (Side by Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Market Sessions (2/3 Width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 h-[600px] relative bg-[#0A0A0A] border border-white/5 rounded-[3.5rem] shadow-2xl overflow-visible p-1 z-50"
          >
            <ForexSessionNavbar />
          </motion.div>

          {/* Quick Notes (1/3 Width) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 h-[600px] relative z-10 bg-[#0A0A0A] border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-2xl flex flex-col"
          >

            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Field Intelligence</span>
                  </div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase opacity-90">Quick Notes</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-yellow-500/80">
                   <Zap size={20} />
                </div>
              </div>
              
              <div className={`flex-1 overflow-hidden transition-opacity duration-500 ${loading ? "opacity-50" : ""}`}>
                <QuickNotesWidget />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Widget System (Full Width) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative z-10 transition-all duration-500 ${loading ? "opacity-50" : ""}`}
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             <div className="flex items-center gap-3 px-6 py-2 bg-[#0A0A0A]/60 backdrop-blur-md border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Layout size={14} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Detailed Analytics Matrix</span>
             </div>
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          <div className="w-full">
            <WidgetSystem stats={stats} loading={loading} />
          </div>
        </motion.div>
      </div>

      <CreatePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newPortfolio) => {
          refreshPortfolios();
          setSelectedPortfolioId(newPortfolio._id);
        }}
      />
    </div>
  );
}

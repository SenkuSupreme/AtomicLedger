"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TradingCalendar from "@/components/TradingCalendar";
import PortfolioSelector from "@/components/PortfolioSelector";
import { usePortfolios } from "@/context/PortfolioContext";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Globe,
  Database,
  Cpu,
  Shield,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachWeekOfInterval, 
  format, 
  parseISO,
  isSameMonth
} from "date-fns";

export default function CalendarPage() {
  const router = useRouter();
  const { selectedPortfolioId, setSelectedPortfolioId } = usePortfolios();
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<any>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const fetchCalendarData = async (portfolioId: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (portfolioId && portfolioId !== "all") {
        params.append("portfolioId", portfolioId);
      }
      const res = await fetch(`/api/calendar?${params}`);
      const data = await res.json();
      setCalendarData(data);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDayDetails = async (date: string) => {
    try {
      const params = new URLSearchParams({ startDate: date, endDate: date });
      if (selectedPortfolioId && selectedPortfolioId !== "all") params.append("portfolioId", selectedPortfolioId);
      const res = await fetch(`/api/trades?${params}`);
      const data = await res.json();
      setDayDetails(data.trades || []);
    } catch (error) {
      console.error("Failed to fetch day details:", error);
    }
  };

  useEffect(() => {
    fetchCalendarData(selectedPortfolioId);
  }, [selectedPortfolioId]);

  useEffect(() => {
    if (selectedDate) fetchDayDetails(selectedDate);
  }, [selectedDate, selectedPortfolioId]);

  const summaryStats = calendarData.reduce(
    (acc: any, day: any) => {
      acc.totalTrades += day.trades || 0;
      acc.totalPnl += day.pnl || 0;
      if (day.pnl > 0) acc.profitableDays++;
      if (day.trades > 0) acc.activeDays++;
      return acc;
    },
    { totalTrades: 0, totalPnl: 0, profitableDays: 0, activeDays: 0 }
  );

  const getWeeklyBreakdown = () => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const weeks = eachWeekOfInterval({ start: startOfWeek(start), end: endOfWeek(end) })
      .filter(w => isSameMonth(w, viewDate) || isSameMonth(endOfWeek(w), viewDate));
    
    return weeks.map((weekStart, idx) => {
      const weekEnd = endOfWeek(weekStart);
      const displayStart = weekStart < start ? start : weekStart;
      const displayEnd = weekEnd > end ? end : weekEnd;
      const weekData = calendarData.filter(d => {
        const dDate = parseISO(d.date);
        return dDate >= displayStart && dDate <= displayEnd;
      });
      const weekPnl = weekData.reduce((sum: number, d: any) => sum + (d.pnl || 0), 0);
      const weekTrades = weekData.reduce((sum: number, d: any) => sum + (d.trades || 0), 0);
      return {
        label: `Week ${idx + 1}`,
        range: `${format(displayStart, "MMM d")} - ${format(displayEnd, "MMM d")}`,
        pnl: weekPnl,
        trades: weekTrades
      };
    });
  };

  const weeklyStats = getWeeklyBreakdown();

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-emerald-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Temporal Node 09 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Globe size={10} className="text-emerald-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Historical Sync: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Temporal Matrix
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Visual temporal archival of operational outcomes. The grid of probability materialized into a historical record of performance."
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <PortfolioSelector
            currentId={selectedPortfolioId}
            onSelect={setSelectedPortfolioId}
          />
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <Activity size={18} />, label: "Active Days", value: summaryStats.activeDays, color: "blue" },
          { icon: <Layers size={18} />, label: "Total Trades", value: summaryStats.totalTrades, color: "purple" },
          { icon: <Target size={18} />, label: "Profitable Days", value: summaryStats.profitableDays, color: "emerald" },
          { 
            icon: summaryStats.totalPnl >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />, 
            label: "Total Net P&L", 
            value: `$${summaryStats.totalPnl.toFixed(0)}`, 
            color: summaryStats.totalPnl >= 0 ? "emerald" : "red" 
          },
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 shadow-3xl relative overflow-hidden group/calendar"
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
             {loading ? (
               <div className="flex flex-col items-center justify-center h-[600px] gap-6">
                 <div className="w-12 h-12 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">Syncing Matrix...</span>
               </div>
             ) : (
               <TradingCalendar 
                  data={calendarData} 
                  viewDate={viewDate}
                  onMonthChange={setViewDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                  }} 
               />
             )}
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 shadow-3xl h-full flex flex-col relative overflow-hidden group/sidebar"
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
             <div className="flex items-center gap-4 mb-10 relative z-10">
               <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl group-hover/sidebar:bg-emerald-500 transition-all duration-500">
                 <Activity size={20} className="text-emerald-500/50 group-hover/sidebar:text-black transition-colors" />
               </div>
               <div>
                 <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Temporal Stats</h3>
                 <p className="text-lg font-black text-white italic uppercase tracking-tighter">{format(viewDate, "MMMM yyyy")}</p>
               </div>
             </div>

             <div className="space-y-6 relative z-10 flex-1">
               {weeklyStats.map((week, idx) => (
                 <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between hover:bg-white group/week transition-all duration-500 cursor-default">
                    <div>
                      <h4 className="text-[10px] font-black text-white/20 group-hover:text-black/40 uppercase tracking-[0.3em] italic transition-colors">{week.label}</h4>
                      <p className="text-xs font-black text-white group-hover:text-black uppercase italic transition-colors">{week.range}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black italic tracking-tighter group-hover:text-black transition-colors ${week.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {week.pnl >= 0 ? "+" : ""}${Math.abs(week.pnl).toFixed(0)}
                      </div>
                      <div className="text-[9px] font-black text-white/20 group-hover:text-black/30 uppercase tracking-[0.2em] italic mt-1 transition-colors">{week.trades} Signals</div>
                    </div>
                 </div>
               ))}
             </div>

             <div className="mt-10 pt-10 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl p-6 group/tip">
                   <Shield size={24} className="text-white/20 group-hover/tip:text-emerald-400 transition-colors" />
                   <p className="text-[10px] font-medium text-white/30 italic leading-relaxed">
                     "Every pixel on the temporal grid represents a tactical decision. Calibrate the future by analyzing the archival past."
                   </p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

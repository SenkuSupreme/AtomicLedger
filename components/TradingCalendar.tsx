"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarDay {
  date: string;
  trades: number;
  pnl: number;
  emotion?: string;
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

interface TradingCalendarProps {
  data?: CalendarDay[];
  viewDate: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect?: (date: string) => void;
}

export default function TradingCalendar({
  data = [],
  viewDate,
  onMonthChange,
  onDateSelect,
}: TradingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate.toISOString().split("T")[0],
        trades: 0,
        pnl: 0,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateStr = dayDate.toISOString().split("T")[0];
      const dayData = data.find((d) => d.date === dateStr);
      const today = new Date();

      days.push({
        date: dateStr,
        trades: dayData?.trades || 0,
        pnl: dayData?.pnl || 0,
        emotion: dayData?.emotion,
        isToday: dateStr === today.toISOString().split("T")[0],
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate.toISOString().split("T")[0],
        trades: 0,
        pnl: 0,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const navigateMonth = (dir: "prev" | "next") => {
    setDirection(dir === "next" ? 1 : -1);
    const newDate = new Date(viewDate);
    if (dir === "prev") newDate.setMonth(viewDate.getMonth() - 1);
    else newDate.setMonth(viewDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const getPnlIntensity = (pnl: number, trades: number) => {
    if (trades === 0) return "bg-white/[0.02] border-white/[0.05]";
    if (pnl > 0) {
      if (pnl > 1000) return "bg-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.2)]";
      if (pnl > 500) return "bg-green-500 text-white";
      return "bg-green-600/50 text-white";
    } else if (pnl < 0) {
      if (pnl < -1000) return "bg-red-400 text-black shadow-[0_0_20px_rgba(248,113,113,0.2)]";
      if (pnl < -500) return "bg-red-500 text-white";
      return "bg-red-600/50 text-white";
    }
    return "bg-blue-500/20 text-white";
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    setSelectedDate(day.date);
    onDateSelect?.(day.date);
  };

  const days = getDaysInMonth(viewDate);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
      {/* Premium Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Top Controls - Bold & Spacious */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <CalendarIcon size={20} className="text-white/80" />
            </div>
            Monthly Ledger
          </h3>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.4em] mt-1.5 pl-1">
            Institutional Performance Map
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5 shadow-inner">
          <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90">
            <ChevronLeft size={18} className="text-white/60" />
          </button>
          <div className="px-6 text-sm font-black text-white min-w-[150px] text-center uppercase tracking-widest">
            {viewDate.getMonth() !== undefined && monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-90">
            <ChevronRight size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-4 mb-6 relative z-10">
        {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day, i) => (
          <div key={i} className="text-center text-[10px] text-white/20 font-black tracking-widest">{day}</div>
        ))}
      </div>

      {/* Calendar Grid - Expanded Size */}
      <div className="relative min-h-[550px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewDate.toISOString()}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="grid grid-cols-7 gap-4"
          >
            {days.map((day, i) => {
              const dayNum = new Date(day.date).getDate();
              const intensity = getPnlIntensity(day.pnl, day.trades);
              const isSelected = selectedDate === day.date;
              
              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(day)}
                  disabled={!day.isCurrentMonth}
                  className={`
                    relative aspect-[4/3] p-4 rounded-2xl transition-all duration-300
                    flex flex-col justify-between border group/cell
                    ${day.isCurrentMonth ? "cursor-pointer hover:scale-[1.02] hover:z-10 shadow-lg" : "opacity-5 border-transparent pointer-events-none"}
                    ${isSelected ? "ring-2 ring-blue-500 border-transparent z-20 scale-105" : "border-white/5"}
                    ${intensity}
                  `}
                >
                  <div className="w-full flex justify-between items-start">
                    <span className="text-sm font-black tracking-tighter">{dayNum}</span>
                    {day.trades > 0 && day.isCurrentMonth && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold opacity-60 leading-none">{day.trades}</span>
                        <span className="text-[7px] font-mono uppercase opacity-30 mt-0.5 tracking-tighter">Executions</span>
                      </div>
                    )}
                  </div>

                  {day.trades > 0 && day.isCurrentMonth && (
                    <div className="mt-auto">
                      <div className="text-sm font-black tracking-tight leading-none group-hover/cell:scale-110 transition-transform origin-left">
                        {day.pnl >= 0 ? '+' : '-'}${Math.abs(day.pnl).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </div>
                      <div className="mt-1.5 h-1 w-full bg-black/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${day.pnl >= 0 ? 'bg-white/40' : 'bg-white/40'}`} 
                          style={{ width: `${Math.min((Math.abs(day.pnl) / 1500) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {day.emotion && day.isCurrentMonth && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover/cell:opacity-20 transition-opacity">
                      <span className="text-4xl">
                        {day.emotion === 'happy' ? '😊' : day.emotion === 'sad' ? '😔' : '😐'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Expanded Legend */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/5 pt-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-md" /> <span>Critical Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-md" /> <span>Target Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/5 rounded-md" /> <span>No Activity</span>
          </div>
        </div>
        <div>
          Auto-synchronized with global trade ledger
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarHeatmapProps {
  data: { date: string; count: number; pnl: number }[];
}

export default function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; pnl: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate grid data: 26 weeks (6 months) x 7 days
  const weeks = 26;
  const today = new Date();
  
  // Find the start date (the Sunday of the week 25 weeks ago)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - ((weeks - 1) * 7) - today.getDay());

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels: { label: string; index: number }[] = [];

  const grid: string[][] = Array.from({ length: 7 }, () => []);
  
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + (w * 7) + d);
      const dateStr = current.toISOString().split('T')[0];
      grid[d][w] = dateStr;

      // Collect month labels
      if (d === 0 && current.getDate() <= 7) {
        monthLabels.push({
          label: current.toLocaleDateString('en-US', { month: 'short' }),
          index: w
        });
      }
    }
  }

  const getDayData = (dateStr: string) => {
    return data.find(d => d.date === dateStr) || { date: dateStr, count: 0, pnl: 0 };
  };

  const getIntensity = (dayData: { count: number; pnl: number }) => {
    if (dayData.count === 0) return 'bg-white/[0.03] border-white/[0.02]';

    if (dayData.pnl > 0) {
      if (dayData.pnl > 1000) return 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]';
      if (dayData.pnl > 500) return 'bg-green-500/80';
      if (dayData.pnl > 100) return 'bg-green-600/60';
      return 'bg-green-700/40';
    } else if (dayData.pnl < 0) {
      if (dayData.pnl < -1000) return 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
      if (dayData.pnl < -500) return 'bg-red-500/80';
      if (dayData.pnl < -100) return 'bg-red-600/60';
      return 'bg-red-700/40';
    }

    return 'bg-white/20'; // Activity but PnL 0
  };

  const handleMouseMove = (e: React.MouseEvent, dateStr: string) => {
    const dayData = getDayData(dateStr);
    setHoveredDay(dayData);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="w-full relative select-none">
      {/* Month Labels */}
      <div className="flex mb-2 ml-8 relative h-4">
        {monthLabels.map((m, i) => (
          <div 
            key={i} 
            className="absolute text-[9px] text-white/30 font-mono uppercase tracking-tighter"
            style={{ left: `${(m.index / weeks) * 100}%` }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Day Labels */}
        <div className="flex flex-col gap-[3px] pr-2 pt-0.5">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 text-[9px] text-white/20 font-mono leading-none flex items-center">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div 
          className="flex-1 grid gap-[3px]" 
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
        >
           {Array.from({ length: weeks }).map((_, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, d) => {
                  const dateStr = grid[d][w];
                  const dayData = getDayData(dateStr);
                  return (
                    <motion.div
                      key={dateStr}
                      initial={false}
                      className={`aspect-square w-full rounded-[2px] border border-transparent transition-colors cursor-crosshair ${getIntensity(dayData)}`}
                      onMouseMove={(e) => handleMouseMove(e, dateStr)}
                      onMouseLeave={() => setHoveredDay(null)}
                      whileHover={{ scale: 1.2, zIndex: 10, borderColor: 'rgba(255,255,255,0.2)' }}
                    />
                  );
                })}
              </div>
           ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono uppercase tracking-widest">
           <span>Less</span>
           <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-[1px] bg-white/[0.03]" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-green-700/40" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-green-600/60" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-green-500/80" />
              <div className="w-2.5 h-2.5 rounded-[1px] bg-green-400" />
           </div>
           <span>More</span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] text-white/30 font-mono tracking-tighter">
           <span className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> PROFIT
           </span>
           <span className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> LOSS
           </span>
        </div>
      </div>

      {/* Custom Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{ 
              position: 'fixed', 
              left: tooltipPos.x + 15, 
              top: tooltipPos.y - 60,
              pointerEvents: 'none',
              zIndex: 100
            }}
            className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl min-w-[140px]"
          >
            <p className="text-[10px] text-white/40 font-mono uppercase mb-1">
              {new Date(hoveredDay.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-white/60">Trades</span>
                <span className="text-sm font-bold text-white">{hoveredDay.count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-white/60">Net P&L</span>
                <span className={`text-sm font-bold ${hoveredDay.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {hoveredDay.pnl >= 0 ? '+' : ''}${Math.abs(hoveredDay.pnl).toFixed(2)}
                </span>
              </div>
            </div>
            {hoveredDay.count > 0 && (
              <div className="mt-2 pt-2 border-t border-white/5 flex gap-1">
                 {Array.from({ length: Math.min(hoveredDay.count, 5) }).map((_, i) => (
                   <div key={i} className={`h-1 flex-1 rounded-full ${hoveredDay.pnl >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`} />
                 ))}
                 {hoveredDay.count > 5 && <span className="text-[8px] text-white/30">+{hoveredDay.count - 5}</span>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

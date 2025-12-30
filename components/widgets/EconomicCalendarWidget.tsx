"use client";

import React from "react";
import { Calendar, AlertCircle, Clock, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface EconomicCalendarWidgetProps {
  className?: string;
}

export default function EconomicCalendarWidget({
  className = "",
}: EconomicCalendarWidgetProps) {
  // Mock economic events - In a real app, these would come from an API
  const events = [
    {
      time: "08:30",
      currency: "USD",
      event: "Core CPI m/m",
      impact: "high",
      forecast: "0.3%",
      previous: "0.2%",
      isUpcoming: true,
    },
    {
      time: "10:00",
      currency: "CAD",
      event: "BOC Rate Statement",
      impact: "high",
      forecast: "5.00%",
      previous: "5.00%",
      isUpcoming: true,
    },
    {
      time: "14:15",
      currency: "EUR",
      event: "Main Refinancing Rate",
      impact: "high",
      forecast: "4.50%",
      previous: "4.50%",
      isUpcoming: true,
    },
    {
      time: "15:30",
      currency: "USD",
      event: "Unemployment Claims",
      impact: "medium",
      forecast: "215K",
      previous: "210K",
      isUpcoming: true,
    },
  ];

  const getImpactData = (impact: string) => {
    switch (impact) {
      case "high":
        return { color: "bg-red-500", text: "text-red-400", label: "HIGH" };
      case "medium":
        return { color: "bg-orange-500", text: "text-orange-400", label: "MED" };
      default:
        return { color: "bg-yellow-500", text: "text-yellow-400", label: "LOW" };
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Economic Calendar</h3>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em] mt-1">
            Volatility Risk Matrix
          </p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
          <Globe size={16} className="text-white/40" />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {events.map((event, index) => {
          const impact = getImpactData(event.impact);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                      <Clock size={10} /> {event.time}
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5">{event.currency}</span>
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-1" />
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${impact.text} border-current opacity-70`}>
                    {impact.label}
                  </div>
                </div>
                {event.isUpcoming && (
                  <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Live Alert</span>
                  </div>
                )}
              </div>

              <div className="text-sm font-bold text-white/90 group-hover:text-white transition-colors mb-3">
                {event.event}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-2 rounded-xl flex flex-col items-center">
                  <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Forecast</span>
                  <span className="text-xs font-mono text-white/70">{event.forecast}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl flex flex-col items-center">
                  <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Previous</span>
                  <span className="text-xs font-mono text-white/70">{event.previous}</span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowRight size={16} className="text-white/20" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest transition-all">
        View Full Calendar
      </button>
    </div>
  );
}

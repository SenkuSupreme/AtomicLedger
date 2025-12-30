"use client";

import React, { useState, useEffect } from "react";
import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface GoalsProgressWidgetProps {
  className?: string;
}

export default function GoalsProgressWidget({
  className = "",
}: GoalsProgressWidgetProps) {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    // Fetch goals
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals?limit=3");
        const data = await res.json();
        setGoals(data.goals || []);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]";
    if (progress >= 50) return "from-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]";
    return "from-red-500 to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} className="text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />;
      case "in_progress":
        return <Clock size={18} className="text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />;
      default:
        return <Target size={18} className="text-white/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case "in_progress":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      default:
        return "bg-white/5 border-white/10 text-white/60";
    }
  };

  return (
    <div className={`h-full ${className}`}>
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Trading Objectives</span>
          </div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Goals Progress</h3>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-blue-500/80">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <div
              key={goal._id || index}
              className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(goal.status)}
                  <span className="text-sm font-black text-white uppercase tracking-tight truncate">
                    {goal.title}
                  </span>
                </div>
                <span className="text-xl font-black text-white italic tabular-nums ml-3">
                  {goal.progress || 0}%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden border border-white/10">
                <div
                  className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(
                    goal.progress || 0
                  )}`}
                  style={{ width: `${goal.progress || 0}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusColor(goal.status)}`}>
                  {goal.category}
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-black">
                  Due: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 mb-6 inline-block">
              <Target size={32} className="text-white/20" />
            </div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-wider italic">No active goals</p>
          </div>
        )}
      </div>
    </div>
  );
}

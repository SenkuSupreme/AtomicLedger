"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Zap,
  Cpu,
  Globe,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HabitCard from "@/components/HabitCard";
import HabitForm from "@/components/HabitForm";
import { IHabit } from "@/lib/models/Habit";
import { toast } from "sonner";

export default function HabitsPage() {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<IHabit | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch("/api/habits");
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits || []);
      } else {
        toast.error("Failed to fetch habits");
      }
    } catch (error) {
      toast.error("Protocol sync error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (habitData: Partial<IHabit>) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData),
      });

      if (response.ok) {
        const newHabit = await response.json();
        setHabits([newHabit, ...habits]);
        setShowHabitForm(false);
        toast.success("Execution protocol initialized");
      } else {
        toast.error("Protocol failure");
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  const handleUpdateHabit = async (
    habitId: string,
    updates: Partial<IHabit>
  ) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedHabit = await response.json();
        setHabits(
          habits.map((habit) => (habit._id === habitId ? updatedHabit : habit))
        );
        setEditingHabit(undefined);
        setShowHabitForm(false);
        toast.success("Protocol recalibrated");
      } else {
        toast.error("Recalibration failure");
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("Confirm execution protocol termination?")) return;

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHabits(habits.filter((habit) => habit._id !== habitId));
        toast.success("Protocol purged from matrix");
      } else {
        toast.error("Purge failure");
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  const handleCompleteHabit = async (
    habitId: string,
    count: number,
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, notes }),
      });

      if (response.ok) {
        const updatedHabit = await response.json();
        setHabits(
          habits.map((habit) => (habit._id === habitId ? updatedHabit : habit))
        );
        toast.success("Execution artifact registered");
      } else {
        toast.error("Registration failure");
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      (habit.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || habit.category === filterCategory;
    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && habit.isActive) ||
      (filterActive === "inactive" && !habit.isActive);
    return matchesSearch && matchesCategory && matchesActive;
  });

  const stats = {
    total: habits.length,
    active: habits.filter((h) => h.isActive).length,
    totalStreak: habits.reduce((sum, h) => sum + h.streak, 0),
    avgStreak:
      habits.length > 0
        ? Math.round(
            habits.reduce((sum, h) => sum + h.streak, 0) / habits.length
          )
        : 0,
    completedToday: habits.filter((h) => {
      const today = new Date().toDateString();
      return h.completions.some(
        (c) =>
          new Date(c.date).toDateString() === today && c.count >= h.targetCount
      );
    }).length,
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Synchronizing Execution Matrix...
      </div>
    );
  }

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
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Execution Node 02 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Activity size={10} className="text-blue-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol Sync: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Execution Ledger
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Institutional archival of tactical consistency. Your edge is forged in the repetitive precision of the terminal mesh."
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setShowHabitForm(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Protocol</span>
          </button>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
        {[
          { icon: <Target size={18} />, label: "Total Protocols", value: stats.total, color: "blue" },
          { icon: <Database size={18} />, label: "Active Sync", value: stats.active, color: "emerald" },
          { icon: <Calendar size={18} />, label: "Syncs Today", value: stats.completedToday, color: "purple" },
          { icon: <Flame size={18} />, label: "High Streak", value: stats.totalStreak, color: "orange" },
          { icon: <TrendingUp size={18} />, label: "Mean Consistency", value: stats.avgStreak, color: "yellow" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="p-3 bg-white/[0.05] border border-white/10 rounded-2xl text-white/40 group-hover:bg-white group-hover:text-black transition-all">
                   {stat.icon}
                </div>
                <span className="text-3xl font-black italic tracking-tighter text-white/80 group-hover:text-white transition-colors">{stat.value}</span>
             </div>
             <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                {stat.label}
             </div>
          </div>
        ))}
      </div>

      {/* Institutional Filter Mesh */}
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        <div className="flex-1 relative group">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Scan global execution protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-white placeholder:text-white/10 text-[11px] font-black uppercase tracking-[0.3em] focus:border-blue-500/30 focus:outline-none focus:bg-white/[0.04] transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-8 py-6 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-blue-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
          >
            <option value="all">All Domains</option>
            <option value="trading">Trading Sector</option>
            <option value="health">Vitality Lab</option>
            <option value="learning">Knowledge Sync</option>
            <option value="productivity">Output Matrix</option>
            <option value="other">Fragmented</option>
          </select>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-8 py-6 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-blue-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
          >
            <option value="all">All States</option>
            <option value="active">Active Sync</option>
            <option value="inactive">Static Node</option>
          </select>
        </div>
      </div>

      {/* Habits Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={habit._id || index}
            >
              <HabitCard
                habit={habit}
                onUpdate={handleUpdateHabit}
                onDelete={handleDeleteHabit}
                onEdit={(habit) => {
                  setEditingHabit(habit);
                  setShowHabitForm(true);
                }}
                onComplete={handleCompleteHabit}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHabits.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full py-40 text-center relative group overflow-hidden bg-white/[0.01] border border-dashed border-white/10 rounded-[3.5rem]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
          <Flame size={64} className="text-white/20 mx-auto mb-8 relative z-10" />
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Sector Void</h3>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.4em] mb-12 max-w-sm mx-auto italic leading-relaxed">
            "Execution matrix is empty. Awaiting first protocol initialization to begin consistency tracking."
          </p>
          <button
            onClick={() => setShowHabitForm(true)}
            className="group relative inline-flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Protocol 01</span>
          </button>
        </motion.div>
      )}

      {showHabitForm && (
        <HabitForm
          habit={editingHabit}
          onSave={
            editingHabit
              ? (updates) => handleUpdateHabit(editingHabit._id!, updates)
              : handleCreateHabit
          }
          onCancel={() => {
            setShowHabitForm(false);
            setEditingHabit(undefined);
          }}
        />
      )}
    </div>
  );
}

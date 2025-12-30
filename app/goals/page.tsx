"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Target,
  TrendingUp,
  BarChart3,
  Globe,
  Database,
  Activity,
  Zap,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoalCard from "@/components/GoalCard";
import GoalForm from "@/components/GoalForm";
import { IGoal } from "@/lib/models/Goal";
import { toast } from "sonner";

export default function GoalsPage() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      } else {
        toast.error("Failed to fetch goals");
      }
    } catch (error) {
      toast.error("Error fetching goals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData: Partial<IGoal>) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals([newGoal, ...goals]);
        setShowGoalForm(false);
        toast.success("Objective initialized successfully");
      } else {
        toast.error("Failed to initialize objective");
      }
    } catch (error) {
      toast.error("Process failure");
    }
  };

  const handleUpdateGoal = async (goalId: string, updates: Partial<IGoal>) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoals(
          goals.map((goal) => (goal._id === goalId ? updatedGoal : goal))
        );
        setEditingGoal(undefined);
        setShowGoalForm(false);
        toast.success("Objective recalibrated");
      } else {
        toast.error("Recalibration failure");
      }
    } catch (error) {
      toast.error("Process failure");
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Confirm objective deletion protocol?")) return;

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGoals(goals.filter((goal) => goal._id !== goalId));
        toast.success("Objective purged from matrix");
      } else {
        toast.error("Purge failure");
      }
    } catch (error) {
      toast.error("Process failure");
    }
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      (goal.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || goal.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || goal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.status === "completed").length,
    inProgress: goals.filter((g) => g.status === "in-progress").length,
    avgProgress:
      goals.length > 0
        ? Math.round(
            goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Synchronizing Growth Matrix...
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
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Growth Node 07 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Globe size={10} className="text-blue-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Objective Sync: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Growth Terminal
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Strategic objectives and neural performance benchmarks. Architect your growth trajectory within the institutional framework."
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setShowGoalForm(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Objective</span>
          </button>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <Target size={18} />, label: "Total Objectives", value: stats.total, color: "blue" },
          { icon: <Activity size={18} />, label: "Finalized Protocols", value: stats.completed, color: "emerald" },
          { icon: <Database size={18} />, label: "Active Syncs", value: stats.inProgress, color: "amber" },
          { icon: <Cpu size={18} />, label: "Mean Execution", value: `${stats.avgProgress}%`, color: "purple" },
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
            placeholder="Scan global objectives..."
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
            <option value="learning">Knowledge Lab</option>
            <option value="financial">Capital Sector</option>
            <option value="personal">Neural Domain</option>
            <option value="other">Fragmented</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-8 py-6 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-blue-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
          >
            <option value="all">All Status</option>
            <option value="not-started">Pending Sync</option>
            <option value="in-progress">Active Growth</option>
            <option value="completed">Protocol Finished</option>
            <option value="paused">Sync Suspended</option>
          </select>
        </div>
      </div>

      {/* Goals Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredGoals.map((goal, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={goal._id || index}
            >
              <GoalCard
                goal={goal}
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
                onEdit={(goal) => {
                  setEditingGoal(goal);
                  setShowGoalForm(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredGoals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full py-40 text-center relative group overflow-hidden bg-white/[0.01] border border-dashed border-white/10 rounded-[3.5rem] relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
          <Target size={64} className="text-white/20 mx-auto mb-8 relative z-10" />
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Sector Void</h3>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.4em] mb-12 max-w-sm mx-auto italic leading-relaxed">
            "Strategic growth matrix is empty. Awaiting first objective initialization to begin performance tracking."
          </p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="group relative inline-flex items-center gap-4 bg-white text-black hover:bg-blue-500 hover:text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Growth 01</span>
          </button>
        </motion.div>
      )}

      {showGoalForm && (
        <GoalForm
          goal={editingGoal}
          onSave={
            editingGoal
              ? (updates) => handleUpdateGoal(editingGoal._id!, updates)
              : handleCreateGoal
          }
          onCancel={() => {
            setShowGoalForm(false);
            setEditingGoal(undefined);
          }}
        />
      )}
    </div>
  );
}

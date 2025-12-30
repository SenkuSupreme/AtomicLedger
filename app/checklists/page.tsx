"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  Copy,
  Play,
  Target,
  BarChart3,
  Clock,
  Star,
  Search,
  Globe,
  Database,
  Cpu,
  Shield,
  Zap,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  _id: string;
  name: string;
  description: string;
  strategy: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  completionRate: number;
  timesUsed: number;
}

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStrategy, setFilterStrategy] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; checklist: Checklist | null }>({ isOpen: false, checklist: null });

  const fetchChecklists = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checklists");
      const data = await res.json();
      setChecklists(data.checklists || []);
    } catch (error) {
      console.error("Failed to fetch checklists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const filteredChecklists = checklists.filter((checklist) => {
    const matchesSearch = checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) || checklist.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrategy = filterStrategy === "all" || checklist.strategy === filterStrategy;
    return matchesSearch && matchesStrategy;
  });

  const strategies = [...new Set(checklists.map((c) => c.strategy))];

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Synchronizing Verification protocols...
      </div>
    );
  }

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-sky-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Validator Node 21 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Shield size={10} className="text-emerald-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol Verification: Active</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Checklist Matrix
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Institutional pre-trade verification protocols. Decouple emotion from execution through algorithmic validation and tactical checklists."
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative flex items-center gap-4 bg-white text-black hover:bg-emerald-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-white/5 active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Protocol</span>
          </button>
        </div>
      </div>

      {/* Intelligence Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { icon: <CheckSquare size={18} />, label: "Checklists", value: checklists.length, color: "blue" },
          { icon: <Target size={18} />, label: "Active Nodes", value: checklists.filter(c => c.isActive).length, color: "emerald" },
          { icon: <BarChart3 size={18} />, label: "Avg Completion", value: `${checklists.length > 0 ? Math.round(checklists.reduce((acc, c) => acc + c.completionRate, 0) / checklists.length) : 0}%`, color: "purple" },
          { icon: <Activity size={18} />, label: "Total Syncs", value: checklists.reduce((acc, c) => acc + c.timesUsed, 0), color: "orange" },
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

      {/* Institutional Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-emerald-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Scan protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white placeholder:text-white/10 text-[11px] font-black uppercase tracking-[0.3em] focus:border-emerald-500/30 focus:outline-none focus:bg-white/[0.04] transition-all backdrop-blur-md shadow-inner italic"
          />
        </div>

        <select
          value={filterStrategy}
          onChange={(e) => setFilterStrategy(e.target.value)}
          className="px-8 py-5 bg-black/40 border border-white/5 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-emerald-500/30 focus:outline-none transition-all cursor-pointer hover:bg-white/[0.04] backdrop-blur-md"
        >
          <option value="all">All Strategy Sectors</option>
          {strategies.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredChecklists.map((checklist) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={checklist._id}
              className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-10 group hover:border-emerald-500/30 transition-all duration-700 shadow-3xl flex flex-col relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-full italic">
                          {checklist.strategy} Sector
                       </span>
                       {checklist.isActive && <Star size={12} className="text-amber-500 fill-amber-500 animate-pulse" />}
                    </div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{checklist.name}</h3>
                    <p className="text-[11px] font-medium text-white/30 italic mt-3 mb-8 line-clamp-2">"{checklist.description}"</p>
                 </div>
              </div>

              <div className="space-y-4 mb-10 relative z-10">
                 {[
                   { label: "Archived Items", value: checklist.items.length, icon: <Layers size={12} /> },
                   { label: "Calibration Rate", value: `${checklist.completionRate}%`, icon: <Activity size={12} /> },
                   { label: "Sync Cycles", value: checklist.timesUsed, icon: <RefreshCw size={12} /> },
                 ].map((meta, i) => (
                   <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="text-white/20">{meta.icon}</div>
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">{meta.label}</span>
                      </div>
                      <span className="text-sm font-black text-white italic tabular-nums">{meta.value}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-auto flex gap-3 relative z-10">
                 <button
                   onClick={() => setActiveChecklist(checklist)}
                   className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-emerald-500 hover:text-white shadow-xl active:scale-95 italic"
                 >
                   <Play size={14} fill="currentColor" />
                   Execute Sync
                 </button>
                 <div className="flex gap-2">
                    <button onClick={() => setEditingChecklist(checklist)} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white/20 hover:bg-white hover:text-black transition-all">
                       <Edit3 size={16} />
                    </button>
                    <button onClick={() => setDeleteDialog({ isOpen: true, checklist })} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500/40 hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredChecklists.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full py-40 text-center relative group overflow-hidden bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
          <CheckSquare size={64} className="text-white/20 mx-auto mb-10 relative z-10" />
          <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Protocol Void</h3>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] mb-12 max-w-sm mx-auto italic leading-relaxed">
            "Verification matrix is empty. No institutional checklists detected within chosen parameters."
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative inline-flex items-center gap-4 bg-white text-black hover:bg-emerald-500 hover:text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Initialize Alpha Protocol</span>
          </button>
        </motion.div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, checklist: null })}
        onConfirm={() => {
          if (deleteDialog.checklist) {
            deleteChecklist(deleteDialog.checklist._id);
          }
        }}
        title="Protocol Redaction"
        message={`Are you sure you want to terminate "${deleteDialog.checklist?.name}"? Verification artifacts will be permanently purged from the archival matrix.`}
      />
    </div>
  );

  async function deleteChecklist(id: string) {
    try {
      const res = await fetch(`/api/checklists/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchChecklists();
        setDeleteDialog({ isOpen: false, checklist: null });
      }
    } catch (error) {
      console.error("Failed to delete checklist:", error);
    }
  }
}

// Minimal icons for metadata
function Layers({ size }: { size: number }) { return <Database size={size} /> }
function RefreshCw({ size }: { size: number }) { return <Zap size={size} /> }

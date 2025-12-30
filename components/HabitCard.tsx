"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Flame,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  Plus,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { IHabit } from "@/lib/models/Habit";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface HabitCardProps {
  habit: IHabit;
  onUpdate: (habitId: string, updates: Partial<IHabit>) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: IHabit) => void;
  onComplete: (habitId: string, count: number, notes?: string) => void;
}

const categoryColors = {
  trading: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  health: "bg-green-500/20 text-green-400 border-green-500/30",
  learning: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  productivity: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function HabitCard({
  habit,
  onUpdate,
  onDelete,
  onEdit,
  onComplete,
}: HabitCardProps) {
  const router = useRouter();
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completeCount, setCompleteCount] = useState(1);
  const [completeNotes, setCompleteNotes] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCompletion = habit.completions.find(
    (completion) =>
      new Date(completion.date).toDateString() === today.toDateString()
  );

  const isCompletedToday =
    todayCompletion && todayCompletion.count >= habit.targetCount;

  const handleComplete = () => {
    onComplete(habit._id!, completeCount, completeNotes);
    setShowCompleteForm(false);
    setCompleteCount(1);
    setCompleteNotes("");
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-400";
    if (streak >= 14) return "text-blue-400";
    if (streak >= 7) return "text-green-400";
    if (streak >= 3) return "text-yellow-400";
    return "text-white/60";
  };

  const getCompletionRate = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentCompletions = habit.completions.filter(
      (completion) => new Date(completion.date) >= last30Days
    );

    return Math.round((recentCompletions.length / 30) * 100);
  };

  return (
    <>
    <div 
      className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-7 h-full flex flex-col transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer overflow-hidden shadow-2xl"
      onClick={() => router.push(`/details?type=habit&id=${habit._id}`)}
    >
      {/* Background Heat Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 blur-[120px] group-hover:bg-blue-600/20 transition-all duration-1000" />
      
      {/* Persistent Action Header - FRONT PROTECTED */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-40">
        {!habit.isActive && (
           <div className="p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
              <span className="text-[8px] font-black uppercase tracking-widest">Inactive</span>
           </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/details?type=habit&id=${habit._id}`);
          }}
          className="p-2.5 bg-white/5 hover:bg-white text-white/40 hover:text-black rounded-xl border border-white/10 transition-all duration-300"
          title="View Intelligence"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(habit);
          }}
          className="p-2.5 bg-white/5 hover:bg-white text-white/40 hover:text-black rounded-xl border border-white/10 transition-all duration-300"
          title="Edit Protocol"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDialog(true);
          }}
          className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/10 transition-all duration-300"
          title="Purge Node"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Category Node */}
      <div className="mb-6 flex">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-xl border ${categoryColors[habit.category as keyof typeof categoryColors] || categoryColors.other}`}>
           {habit.category || "other"}
        </span>
      </div>

      {/* Content Section */}
      <div className="relative z-10 space-y-4 flex-1 pointer-events-none">
        <h3 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase italic pr-24">
          {habit.title}
        </h3>
        
        {habit.description && (
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-medium italic">
            "{habit.description}"
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center group-hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-1.5 ${getStreakColor(habit.streak)}`}>
              <Flame size={14} />
              <span className="text-lg font-black">{habit.streak}</span>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Streak</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center group-hover:border-white/10 transition-colors">
            <div className="flex items-center gap-1.5 text-blue-400">
              <TrendingUp size={14} />
              <span className="text-lg font-black">{habit.longestStreak}</span>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Best</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center group-hover:border-white/10 transition-colors">
            <div className="flex items-center gap-1.5 text-green-400">
              <Calendar size={14} />
              <span className="text-lg font-black">{getCompletionRate()}%</span>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Rate</span>
          </div>
        </div>
      </div>

      {/* Action Mesh */}
      <div className="mt-8 space-y-4 relative z-50">
        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            <span>Today's Execution</span>
            <span className="text-white/60">{todayCompletion?.count || 0} / {habit.targetCount}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isCompletedToday ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(((todayCompletion?.count || 0) / habit.targetCount) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Dynamic Multi-State Button */}
        {habit.isActive && (
          <div className="flex gap-2">
            {isCompletedToday ? (
              <div className="flex-1 bg-green-500 text-white py-4 px-6 rounded-[1.5rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-500/10 border border-green-400/20">
                <CheckCircle size={16} />
                Terminal Ready
              </div>
            ) : (
              <div className="flex-1">
                {!showCompleteForm ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCompleteForm(true);
                    }}
                    className="w-full bg-white text-black py-4 px-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-95"
                  >
                    <Plus size={18} />
                    Log Execution
                  </button>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1 block">Count</label>
                        <input
                          type="number"
                          min="1"
                          value={completeCount}
                          onChange={(e) => setCompleteCount(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-bold focus:border-blue-500/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1 block">Institutional Notes</label>
                        <input
                          type="text"
                          placeholder="Analysis notes..."
                          value={completeNotes}
                          onChange={(e) => setCompleteNotes(e.target.value)}
                          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/20 text-xs font-bold focus:border-blue-500/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete();
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                      >
                        Transmit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCompleteForm(false);
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Footer Metadata */}
      <div className="mt-8 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/10 pt-5 border-t border-white/5 relative z-10 w-full">
        <div className="flex items-center gap-2">
          <span>{habit.frequency} PROTOCOL</span>
          <span className="text-white/5">•</span>
          <span>{habit.targetCount}X SIGNAL REQUIRED</span>
        </div>
      </div>
      </div>

      {/* Delete Confirmation Dialog - ISOLATED MESH */}
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteConfirmDialog
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          onConfirm={() => onDelete(habit._id!)}
          title="Institutional Removal"
          message={`Are you sure you want to purge "${habit.title}" from the ledger? This action is irreversible.`}
        />
      </div>
    </>
  );
}

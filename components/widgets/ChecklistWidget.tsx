"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Play, Plus, Target } from "lucide-react";

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
  isActive: boolean;
  completionRate: number;
  timesUsed: number;
}

interface ChecklistWidgetProps {
  className?: string;
}

export default function ChecklistWidget({
  className = "",
}: ChecklistWidgetProps) {
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(
    null
  );
  const [currentItems, setCurrentItems] = useState<ChecklistItem[]>([]);
  const [showQuickUse, setShowQuickUse] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch active checklist
  const fetchActiveChecklist = async () => {
    try {
      const res = await fetch("/api/checklists");
      const data = await res.json();
      const active = data.checklists?.find((c: Checklist) => c.isActive);
      setActiveChecklist(active || null);

      if (active) {
        setCurrentItems(
          active.items.map((item: any) => ({ ...item, completed: false }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch active checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveChecklist();
  }, []);

  const toggleItem = (id: string) => {
    setCurrentItems((items: any[]) =>
      items.map((item: any) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetChecklist = () => {
    if (activeChecklist) {
      setCurrentItems(
        activeChecklist.items.map((item: any) => ({ ...item, completed: false }))
      );
    }
  };

  const completeChecklist = async () => {
    if (!activeChecklist) return;

    try {
      const res = await fetch(`/api/checklists/${activeChecklist._id}/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedItems: currentItems }),
      });

      if (res.ok) {
        resetChecklist();
        setShowQuickUse(false);
        fetchActiveChecklist();
      } else {
        console.error("Failed to complete checklist:", await res.text());
      }
    } catch (error) {
      console.error("Failed to complete checklist:", error);
    }
  };

  const completedCount = currentItems.filter((item: any) => item.completed).length;
  const completionPercentage =
    currentItems.length > 0
      ? Math.round((completedCount / currentItems.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-white/40 text-sm font-black uppercase tracking-wider italic animate-pulse">Loading checklist...</div>
      </div>
    );
  }

  if (!activeChecklist) {
    return (
      <div className={`h-full ${className}`}>
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">No Active Checklist</span>
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Pre-Trade Checklist</h3>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-red-500/80">
            <Target size={20} />
          </div>
        </div>

        <div className="text-center py-12">
          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 mb-6 inline-block">
            <CheckSquare size={48} className="text-white/20" />
          </div>
          <p className="text-sm text-white/60 mb-6 font-medium italic max-w-xs mx-auto leading-relaxed">
            No active checklist found. Create and activate a checklist to use this widget.
          </p>
          <a
            href="/checklists"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-xl"
          >
            <Plus size={14} />
            Manage Checklists
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{activeChecklist.name}</span>
          </div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Pre-Trade Checklist</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-black px-3 py-1 bg-white/5 rounded-full border border-white/10">
            {activeChecklist.strategy}
          </span>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-green-500/80">
            <CheckSquare size={20} />
          </div>
        </div>
      </div>

      {!showQuickUse ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
              <div className="text-2xl font-black text-white italic tabular-nums mb-1">
                {activeChecklist.completionRate}%
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Rate</div>
            </div>
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
              <div className="text-2xl font-black text-white italic tabular-nums mb-1">
                {activeChecklist.timesUsed}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Uses</div>
            </div>
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
              <div className="text-2xl font-black text-white italic tabular-nums mb-1">
                {activeChecklist.items.length}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Items</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Preview:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
              {activeChecklist.items.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 text-xs text-white/60 p-2 bg-white/[0.02] rounded-xl border border-white/5"
                >
                  <Square size={12} className="text-white/30" />
                  <span className="font-medium">
                    {index + 1}. {item.text}
                  </span>
                </div>
              ))}
              {activeChecklist.items.length > 3 && (
                <div className="text-[10px] text-white/30 pl-4 font-black uppercase tracking-wider italic">
                  +{activeChecklist.items.length - 3} more items...
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowQuickUse(true)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-500 hover:text-white transition-all shadow-xl"
          >
            <Play size={16} />
            Start Checklist
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Progress</span>
            <span className="text-sm font-black text-white italic tabular-nums">
              {completedCount}/{currentItems.length} ({completionPercentage}%)
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {currentItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                onClick={() => toggleItem(item.id)}
              >
                {item.completed ? (
                  <CheckSquare
                    size={18}
                    className="text-green-400 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  />
                ) : (
                  <Square size={18} className="text-white/30 flex-shrink-0 group-hover:text-white/50 transition-colors" />
                )}
                <span className="text-[10px] text-white/30 w-5 font-black">{index + 1}.</span>
                <span
                  className={`text-xs flex-1 font-medium transition-all ${
                    item.completed ? "text-white/40 line-through italic" : "text-white group-hover:text-white"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={resetChecklist}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-2xl transition-all"
            >
              Reset
            </button>
            <button
              onClick={completeChecklist}
              disabled={completedCount === 0}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-wider bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
            >
              Complete ({completionPercentage}%)
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/5">
        <a
          href="/checklists"
          className="flex items-center justify-center gap-2 text-[10px] text-white/40 hover:text-white transition-colors font-black uppercase tracking-wider"
        >
          <CheckSquare size={12} />
          Manage Checklists
        </a>
      </div>
    </div>
  );
}

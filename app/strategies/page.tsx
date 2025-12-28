
'use client';

import { useState, useEffect } from 'react';
import { Layers, Plus, Search, Trash2, Edit3, Grid, List as ListIcon, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotionStrategyEditor from '@/components/NotionStrategyEditor';

interface Strategy {
  _id: string;
  name: string;
  coreInfo?: {
      marketFocus: string[];
      instrumentFocus: string[];
  };
  createdAt: string; isTemplate?: boolean;
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [searchQuery, setSearchQuery] = useState(''); const [showTemplates, setShowTemplates] = useState(false);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/strategies');
        const data = await res.json();
        setStrategies(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this strategy?')) return;
      try {
          await fetch(`/api/strategies?id=${id}`, { method: 'DELETE' });
          fetchStrategies();
      } catch (err) {
          console.error(err);
      }
  };

  const filteredStrategies = strategies.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) && (showTemplates ? s.isTemplate : !s.isTemplate)
  );

  if (editingId) {
      return (
          <NotionStrategyEditor 
              strategyId={editingId === 'new' ? undefined : editingId} 
              onBack={() => {
                  setEditingId(null);
                  fetchStrategies();
              }}
          />
      );
  }

  return (
    <div className="min-h-screen p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg">
                  <Layers size={20} className="text-sky-500" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Playbook Labs</h1>
          </div>
          <p className="text-white/70 text-sm font-medium tracking-wide">Codify your edge. Architect institutional-grade trading systems.</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button onClick={() => setShowTemplates(false)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!showTemplates ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/60"}`}>Systems</button>
                <button onClick={() => setShowTemplates(true)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showTemplates ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/60"}`}>Blueprints</button>

                <button 
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'}`}
                >
                    <ListIcon size={18} />
                </button>
            </div>
            <button 
                onClick={() => setEditingId('new')}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
                <Plus size={16} strokeWidth={3} />
                Build {showTemplates ? 'Blueprint' : 'System'}
            </button>
        </div>
      </header>

      {/* Search & Stats */}
      <div className="flex items-center gap-6 pb-12 border-b border-white/5">
          <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search strategies, markets, or setups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl h-14 pl-12 pr-6 text-sm outline-none focus:ring-1 ring-sky-500/30 text-white transition-all placeholder:text-white/20"
              />
          </div>
          <div className="hidden lg:flex items-center gap-8 px-8 shrink-0">
                <div className="text-center">
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Active Systems</p>
                    <p className="text-xl font-black text-white">{strategies.length}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/5" />
                <div className="text-center">
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Avg Grade</p>
                    <p className="text-xl font-black text-emerald-500">A-</p>
                </div>
          </div>
      </div>

      <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>
        <AnimatePresence mode="popLayout">
            {filteredStrategies.map((strategy) => (
            <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={strategy._id} 
                onClick={() => setEditingId(strategy._id)}
                className={view === 'grid' ? 
                    "group relative bg-[#0A0A0A] rounded-[2rem] border border-white/10 p-8 hover:border-sky-500/30 hover:bg-white/[0.02] transition-all cursor-pointer overflow-hidden" :
                    "group flex items-center justify-between bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 hover:border-sky-500/30 transition-all cursor-pointer"
                }
            >
                {view === 'grid' ? (
                    <>
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(strategy._id); }}
                                className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <Edit3 size={20} className="text-sky-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white group-hover:text-sky-500 transition-colors line-clamp-1">{strategy.name}</h3>
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Modified {new Date(strategy.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {strategy.coreInfo?.marketFocus.map((m, i) => (
                                    <span key={i} className="px-3 py-1 bg-sky-500/5 border border-sky-500/10 rounded-full text-[9px] font-black text-sky-500 uppercase tracking-widest">
                                        {m}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-white/60">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Core</p>
                                <MoreVertical size={16} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                <Edit3 size={18} className="text-sky-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white group-hover:text-sky-500 transition-colors">{strategy.name}</h3>
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">{strategy.coreInfo?.marketFocus.join(' • ')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <p className="text-xs font-mono text-white/60 hidden md:block">{new Date(strategy.createdAt).toLocaleDateString()}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(strategy._id); }}
                                className="p-2 opacity-0 group-hover:opacity-100 bg-rose-500/10 text-rose-500 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
            ))}
        </AnimatePresence>

        {!loading && filteredStrategies.length === 0 && (
          <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01] animate-in fade-in zoom-in duration-700">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Layers size={32} className="text-white/10" />
             </div>
             <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Your Playbook is Empty</h3>
             <p className="text-white/60 text-sm max-w-sm mx-auto mb-8 font-medium">Ready to architect your edge? Start by building your first institutional trading framework.</p>
             <button 
                onClick={() => setEditingId('new')}
                className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-2xl"
             >
                Create Strategy 01
             </button>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Grid, 
  List as ListIcon, 
  MoreVertical,
  BookOpen,
  Calendar,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotionNoteEditor from "@/components/NotionNoteEditor";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Note {
  _id: string;
  title: string;
  category?: string;
  blocks?: any[];
  isDetailed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NotesDetailedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editingId, setEditingId] = useState<string | null | "new">(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes?isDetailed=true");
      const data = await res.json();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await fetch(`/api/notes/${noteToDelete}`, { method: "DELETE" });
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setNoteToDelete(null);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingId) {
    return (
      <NotionNoteEditor
        noteId={editingId === "new" ? undefined : editingId}
        onBack={() => {
          setEditingId(null);
          fetchNotes();
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen pb-20 font-sans text-white">
      {/* Institutional Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-primary/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1200px] h-[1200px] bg-secondary/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-10 relative z-10 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Detailed Intel Active</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.02em] italic uppercase bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent leading-none">
              Notes <span className="text-blue-500/50 text-2xl lg:text-3xl">(Detailed)</span>
            </h1>
            <p className="text-white/80 text-xs md:text-sm font-medium italic max-w-xl leading-relaxed">
              "Create high-fidelity notes using the same infrastructure as your strategies. Perfect for market reviews, long-form journals, and complex analyses."
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex bg-card/60 p-1 rounded-2xl border border-border backdrop-blur-md">
              <button
                onClick={() => setView("grid")}
                className={`p-3 rounded-xl transition-all ${
                  view === "grid" ? "bg-foreground text-background shadow-xl" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-3 rounded-xl transition-all ${
                  view === "list" ? "bg-foreground text-background shadow-xl" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListIcon size={18} />
              </button>
            </div>
            <button
              onClick={() => {
                setEditingId("new");
              }}
              className="group relative flex items-center gap-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-8 py-3.5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-background/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Plus size={18} className="relative z-10" />
              <span className="relative z-10">New Detailed Note</span>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="relative group z-10">
          <Search
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 transition-colors"
          />
          <input
            type="text"
            placeholder="Search detailed notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-card/40 border border-border rounded-3xl text-white/90 placeholder:text-white/40 text-[11px] font-black uppercase tracking-[0.3em] focus:border-blue-500/50 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* Notes Matrix */}
        <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10" : "space-y-4 relative z-10"}>
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={note._id}
                onClick={() => setEditingId(note._id)}
                className={
                  view === "grid"
                    ? "group relative bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 hover:border-primary/30 transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-[320px] shadow-2xl"
                    : "group flex items-center justify-between bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border p-8 hover:border-primary/30 transition-all cursor-pointer shadow-xl"
                }
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
                
                {view === "grid" ? (
                  <>
                    {/* Dynamic Glow Gradient */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-colors duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 blur-[80px] group-hover:bg-purple-500/10 transition-colors duration-700" />

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)] pointer-events-none opacity-50" />

                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note._id);
                        }}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 rounded border text-[9px] font-mono uppercase tracking-wider w-fit ${
                                 note.category === 'trading' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                 note.category === 'analysis' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                 note.category === 'strategy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                 note.category === 'journal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                              }`}>
                                 {note.category || "INTEL_NOTE"}
                              </span>
                              <h3 className="text-lg font-bold text-white/90 group-hover:text-blue-200 transition-colors leading-tight line-clamp-2">
                                 {note.title}
                              </h3>
                           </div>
                        </div>

                        <div className="min-h-[60px]">
                          {note.blocks && note.blocks.length > 0 ? (
                            <div className="space-y-2">
                                {note.blocks.filter((b:any) => b.type === 'text' || b.type === 'callout').slice(0, 2).map((b: any, i: number) => (
                                  <p key={i} className="text-[10px] text-white/60 font-mono line-clamp-2 leading-relaxed">
                                    "{b.content.replace(/<[^>]*>/g, '') || "..."}"
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-white/40 font-mono italic">No content preview...</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">::</span>
                          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">SYNC_OK</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Scan Line */}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
                  </>
                ) : (
                    <div className="flex items-center justify-between w-full relative z-10 px-4">
                      {/* Grid Pattern Overlay for List */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-20" />
                      
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="w-12 h-12 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                          <BookOpen size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white/90 group-hover:text-blue-200 transition-colors">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className={`px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-wider ${
                                 note.category === 'trading' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                 note.category === 'analysis' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                 note.category === 'strategy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                 note.category === 'journal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                            }`}>
                               {note.category || "INTEL_NOTE"}
                            </span>
                            <span className="text-[9px] font-mono text-white/50 uppercase">Modified {new Date(note.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    <div className="flex items-center gap-6 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note._id);
                        }}
                        className="p-3 opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* List Hover Scan Line */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && filteredNotes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-40 text-center relative group overflow-hidden bg-foreground/[0.01] border border-dashed border-border rounded-[3.5rem]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
              <BookOpen size={64} className="text-white/30 mx-auto mb-8 relative z-10" />
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">No Detailed Notes Found</h3>
              <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.4em] mb-12 max-w-sm mx-auto italic leading-relaxed">
                "Start documenting your institutional insights with high-fidelity blocks."
              </p>
              <button
                 onClick={() => {
                   setEditingId("new");
                 }}
                 className="group relative inline-flex items-center gap-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(var(--foreground),0.1)] active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-background/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Plus size={18} className="relative z-10" />
                <span className="relative z-10">Create Detailed Note</span>
              </button>
            </motion.div>
          )}
        </div>

        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={confirmDelete}
          title="Delete Detailed Note?"
          description="This will permanently delete this high-fidelity note. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
}

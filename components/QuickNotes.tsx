
'use client';

import { useState } from 'react';
import { Plus, X, StickyNote, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickNotes() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const [note, setNote] = useState('');

    const handleSave = async () => {
        if (!note.trim()) return;

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: note.slice(0, 50) + (note.length > 50 ? "..." : ""),
                    content: note,
                    category: "trading",
                    priority: "medium",
                    isQuickNote: true,
                    color: "#fef3c7",
                }),
            });

            if (res.ok) {
                setNote('');
                setIsOpen(false);
                // Optionally dispatch an event to refresh other widgets
                window.dispatchEvent(new Event('noteCreated'));
            }
        } catch (error) {
            console.error("Failed to save note:", error);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            {/* Quick Notes Tooltip */}
            <AnimatePresence>
                {showLabel && !isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap"
                    >
                        Quick Notes
                        <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-white" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB */}
            <button 
                onMouseEnter={() => setShowLabel(true)}
                onMouseLeave={() => setShowLabel(false)}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 transform
                    ${isOpen ? 'bg-white text-black rotate-45' : 'bg-white text-black hover:scale-110 active:scale-95'}
                `}
            >
                <Plus size={24} strokeWidth={2.5} />
            </button>

            {/* Note Entry Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="absolute bottom-20 right-0 w-[400px] bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="p-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <StickyNote size={18} className="text-gray-400" />
                                <h3 className="font-bold text-sm uppercase tracking-widest text-white">New Quick Note</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <textarea 
                                autoFocus
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Jot down a quick signal, strategy idea, or market observation..."
                                className="w-full h-48 bg-transparent border-none outline-none text-gray-300 resize-none leading-relaxed placeholder:text-gray-700 font-medium"
                            />
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-3 rounded-xl transition-all border border-white/5 text-xs uppercase"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-[2] bg-white text-black hover:bg-gray-100 font-bold py-3 rounded-xl transition-all shadow-xl shadow-white/5 text-xs uppercase flex items-center justify-center gap-2"
                                >
                                    <Save size={14} />
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

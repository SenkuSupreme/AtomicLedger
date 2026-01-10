"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AddSymbolForm } from '@/components/insights/AddSymbolForm';
import { ForecastCard } from '@/components/insights/ForecastCard';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';

interface WatchlistItem {
  _id: string;
  symbol: string;
  type: string;
}

export default function InsightsPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        setWatchlist(await res.json());
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAdd = async (symbol: string, type: string) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, type }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setWatchlist(prev => [newItem, ...prev]);
        toast.success(`Added ${symbol} to watchlist`);
      } else if (res.status === 409) {
        toast.error('Symbol already in watchlist');
      } else {
        throw new Error('Failed to add');
      }
    } catch (error) {
       toast.error('Failed to add symbol');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      // Optimistic update
      const prev = [...watchlist];
      setWatchlist(watchlist.filter(item => item._id !== id));

      const res = await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setWatchlist(prev); // Revert
        toast.error('Failed to remove');
      } else {
        toast.success('Removed from watchlist');
      }
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <header className="flex flex-col items-center justify-center text-center space-y-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4"
                >
                    <BrainCircuit size={14} />
                    Neural Market Analysis
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20"
                >
                    Market Insights
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl text-white/40 text-lg leading-relaxed"
                >
                    Advanced AI forecasting using Smart Money Concepts, ICT methodologies, and Candle Range Theory.
                </motion.p>
            </header>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <AddSymbolForm onAdd={handleAdd} />
            </motion.div>

            {/* Content Grid */}
            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {loading ? (
                    // Skeletons
                    [1,2,3].map(i => (
                        <div key={i} className="h-[300px] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : watchlist.length > 0 ? (
                    watchlist.map((item) => (
                        <ForecastCard 
                            key={item._id}
                            id={item._id}
                            symbol={item.symbol}
                            type={item.type}
                            onRemove={handleRemove}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex p-6 rounded-full bg-white/5 mb-4">
                            <Sparkles className="text-white/20" size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-white/40">Watchlist is empty</h3>
                        <p className="text-white/20 mt-2">Add a symbol above to generate insights.</p>
                    </div>
                )}
            </motion.div>

        </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowRight, 
  Zap,
  BarChart2,
  AlertCircle,
  Loader2,
  Trash2,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
    symbol: string;
    currentPrice: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    probability: number;
    signals: string[];
    concepts: {
      smc: string[];
      ict: string[];
      orb: string[];
      crt: string[];
    };
    analyzedAt: string;
}

interface ForecastCardProps {
  id: string; // Watchlist Item ID
  symbol: string;
  type: string;
  onRemove: (id: string) => void;
}

export function ForecastCard({ id, symbol, type, onRemove }: ForecastCardProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved analysis from DB on mount
  useEffect(() => {
      const loadSavedData = async () => {
          setLoading(true);
          try {
            const res = await fetch(`/api/insights/forecast?symbol=${symbol}`);
            if (res.ok) {
                const json = await res.json();
                if (json) setData(json);
            }
          } catch (e) {
             console.error("Failed to load saved forecast", e);
          } finally {
             setLoading(false);
          }
      };
      
      loadSavedData();
  }, [symbol]);

  // Trigger fresh analysis (Heavy Operation)
  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const finalRes = await fetch(`/api/insights/forecast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol })
      });
      
      if (!finalRes.ok) {
         if (finalRes.status === 503) throw new Error("Rate Limit or Data Error");
         throw new Error("Failed to fetch");
      }
      
      const json = await finalRes.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob > 70) return 'text-emerald-400';
    if (prob < 30) return 'text-rose-400';
    return 'text-amber-400';
  };

  const getTrendIcon = (trend: string) => {
      if (trend === 'BULLISH') return <TrendingUp className="text-emerald-400" size={24} />;
      if (trend === 'BEARISH') return <TrendingDown className="text-rose-400" size={24} />;
      return <Activity className="text-amber-400" size={24} />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 overflow-hidden hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full"
    >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full gap-4">
             {/* Header Section */}
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-black text-white/90 tracking-tighter">{symbol}</h3>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{type}</span>
                </div>
                <div className="flex gap-2">
                     <button
                        onClick={(e) => {
                             e.stopPropagation();
                            runAnalysis();
                        }}
                        disabled={loading}
                        className="p-2 rounded-full bg-white/5 hover:bg-indigo-500/20 text-white/20 hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/refresh"
                     >
                         <RefreshCw size={16} className={`transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} />
                     </button>
                     <button 
                        onClick={() => onRemove(id)}
                        className="p-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/20 hover:text-rose-400 transition-colors"
                     >
                         <Trash2 size={16} />
                     </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 min-h-[140px]">
                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-400" size={32} />
                        <span className="text-xs text-indigo-300 font-mono animate-pulse">Analyzing Market Structure...</span>
                    </div>
                ) : data ? (
                    <div className="w-full space-y-4">
                        <div className="text-center">
                             <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-black/40 border border-white/5 shadow-2xl mb-2">
                                {getTrendIcon(data.trend)}
                            </div>
                            <div className="flex flex-col">
                                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                                     {data.probability}%
                                 </span>
                                 <span className={`text-xs font-bold uppercase tracking-widest ${getProbabilityColor(data.probability)}`}>
                                     Probability
                                 </span>
                            </div>
                        </div>
                        
                        {/* Use flex-col to stack signals */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider text-center mb-2">Key Signals</p>
                            {data.signals.slice(0, 2).map((sig, i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-2 text-xs text-white/70 text-center truncate px-2">
                                    {sig}
                                </div>
                            ))}
                            {data.signals.length === 0 && (
                                <div className="text-xs text-white/30 text-center italic">No strong signals</div>
                            )}
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-2 text-rose-400">
                        <AlertCircle size={24} />
                        <span className="text-xs font-bold text-center">{error}</span>
                        <Button variant="ghost" size="sm" onClick={runAnalysis} className="text-xs mt-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300">Retry</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Zap className="text-indigo-400 opacity-50 group-hover:opacity-100 group-hover:text-indigo-300 transition-all" size={32} />
                        </div>
                        <span className="text-xs text-white/30 text-center max-w-[150px]">
                            Ready to analyze SMC, ICT & ORB patterns
                        </span>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-4">
                {data ? (
                     <Link href={`/analytics/insights/${symbol}`} className="block w-full">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-xs shadow-lg shadow-indigo-500/20" size="lg">
                            View Full Report <ArrowRight size={14} className="ml-2" />
                        </Button>
                     </Link>
                ) : (
                     <Button 
                        onClick={runAnalysis} 
                        disabled={loading}
                        className="w-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 font-bold tracking-wider uppercase text-xs backdrop-blur-sm transition-all"
                        size="lg"
                     >
                        Analyze <Zap size={14} className="ml-2 fill-current" />
                     </Button>
                )}
            </div>
        </div>
    </motion.div>
  );
}

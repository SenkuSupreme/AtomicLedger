"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Loader2, Sparkles, Activity, Target, BrainCircuit, BarChart2 } from 'lucide-react';
import Link from 'next/link';
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

export default function DetailedInsightPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params?.symbol as string;

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/insights/forecast?symbol=${symbol}`);
      if (!res.ok) {
        if (res.status === 503) throw new Error("API Rate Limit. Please wait a moment.");
        throw new Error("Failed to fetch analysis.");
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchAnalysis();
    }
  }, [symbol]);

  if (!symbol) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
         {/* Background FX */}
        <div className="fixed inset-0 pointer-events-none">
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 ${data?.trend === 'BULLISH' ? 'bg-emerald-600' : data?.trend === 'BEARISH' ? 'bg-rose-600' : 'bg-indigo-600'}`} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="rounded-full w-12 h-12 p-0 hover:bg-white/10" onClick={() => router.back()}>
                    <ArrowLeft size={24} />
                </Button>
                <div>
                   <h1 className="text-4xl font-black tracking-tighter text-white">{symbol}</h1>
                   <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                       Deep Neural Analysis
                   </div>
                </div>
                <div className="ml-auto flex gap-3">
                     <Button 
                        onClick={fetchAnalysis}
                        disabled={loading}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/5 gap-2"
                     >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh Analysis
                     </Button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <Loader2 size={64} className="text-indigo-400 animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-white/60">Forecasting Price Action...</h2>
                    <p className="text-white/30 mt-2 font-mono text-sm max-w-md text-center">
                        Synthesizing Smart Money Concepts, ICT patterns, and Volatility models.
                    </p>
                </div>
            ) : error ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                    <AlertCircle size={64} className="text-rose-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
                    <p className="text-white/40 mt-2 mb-6">{error}</p>
                    <Button onClick={fetchAnalysis}>Try Again</Button>
                </div>
            ) : data ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Score Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${data.trend === 'BULLISH' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-4 italic">Directional Bias</h3>
                            
                            <div className="relative mb-6">
                                <span className={`text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b ${
                                    data.trend === 'BULLISH' ? 'from-emerald-300 to-emerald-600' : 
                                    data.trend === 'BEARISH' ? 'from-rose-300 to-rose-600' : 
                                    'from-amber-300 to-amber-600'
                                }`}>
                                    {data.probability}%
                                </span>
                                <div className={`absolute -top-3 -right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                    data.trend === 'BULLISH' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 
                                    data.trend === 'BEARISH' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 
                                    'bg-amber-500/20 border-amber-500/30 text-amber-400'
                                }`}>
                                    {data.trend}
                                </div>
                            </div>

                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-6 shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.probability}%` }}
                                    className={`h-full ${
                                        data.trend === 'BULLISH' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                                        data.trend === 'BEARISH' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 
                                        'bg-amber-500'
                                    }`}
                                />
                            </div>

                            <div className="text-2xl font-mono font-bold text-white mb-1">
                                ${data.currentPrice.toFixed(2)}
                            </div>
                            <span className="text-xs text-white/30 uppercase tracking-wider">Current Price</span>
                            
                            {data.analyzedAt && (
                                <div className="mt-6 pt-6 border-t border-white/5 w-full text-[10px] text-white/20 font-mono">
                                    Last Analysis: {new Date(data.analyzedAt).toLocaleTimeString()}
                                </div>
                            )}
                        </div>

                         <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-400" />
                                Confirmed Signals
                            </h4>
                            <div className="space-y-2">
                                {data.signals.map((sig, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] shrink-0" />
                                        <span className="text-sm font-medium text-white/80 leading-relaxed">{sig}</span>
                                    </div>
                                ))}
                                {data.signals.length === 0 && (
                                    <span className="text-white/30 italic text-sm">No strong signals detected.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis Concepts */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href={`/analytics/insights/${symbol}/smc`}>
                                <div className="cursor-pointer transition-transform hover:scale-[1.02]">
                                    <ConceptCard 
                                        title="Smart Money Concepts" 
                                        subtitle="Structure & Flow"
                                        items={data.concepts.smc} 
                                        icon={BrainCircuit}
                                        color="indigo" 
                                    />
                                </div>
                            </Link>
                             <Link href={`/analytics/insights/${symbol}/ict`}>
                                <div className="cursor-pointer transition-transform hover:scale-[1.02]">
                                    <ConceptCard 
                                        title="ICT Methodologies" 
                                        subtitle="Liquidity & Precision"
                                        items={data.concepts.ict} 
                                        icon={Target}
                                        color="purple" 
                                    />
                                </div>
                            </Link>
                            <Link href={`/analytics/insights/${symbol}/orb`}>
                                <div className="cursor-pointer transition-transform hover:scale-[1.02]">
                                    <ConceptCard 
                                        title="Opening Range Breakout" 
                                        subtitle="Session Momentum"
                                        items={data.concepts.orb} 
                                        icon={Activity}
                                        color="sky" 
                                    />
                                </div>
                            </Link>
                            <Link href={`/analytics/insights/${symbol}/crt`}>
                                <div className="cursor-pointer transition-transform hover:scale-[1.02]">
                                    <ConceptCard 
                                        title="Candle Range Theory" 
                                        subtitle="Volatility & Expansion"
                                        items={data.concepts.crt} 
                                        icon={BarChart2}
                                        color="pink" 
                                    />
                                </div>
                            </Link>
                        </div>

                         {/* AI Interpretation (Synthesis) */}
                         <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
                             <div className="relative z-10">
                                 <h3 className="text-xl font-black italic uppercase italic tracking-tighter text-white mb-2">Algorithm Interpretation</h3>
                                 <p className="text-white/60 text-base leading-relaxed font-medium">
                                     The neural engine suggests a 
                                     <span className={`font-black mx-1.5 uppercase ${data.trend === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}`}>{data.trend}</span> 
                                     regimé based on {data.signals.length} confluence factors. 
                                     {data.probability > 70 ? " High conviction setup confirmed." : " Moderate probability; await displacement before engagement."}
                                     {data.concepts.smc.length > 0 && " Market structure aligns with institutional delivery."}
                                     {data.concepts.ict.length > 0 && " Major liquidity objectives have been validated."}
                                 </p>
                             </div>
                             {/* Background noise */}
                             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                         </div>
                    </div>
                </motion.div>
            ) : null}
        </div>
    </div>
  );
}

function ConceptCard({ title, subtitle, items, icon: Icon, color }: any) {
    const colors: any = {
        indigo: 'hover:border-indigo-500/50 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)] bg-indigo-500/[0.02]',
        purple: 'hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-purple-500/[0.02]',
        sky: 'hover:border-sky-500/50 hover:shadow-[0_0_50px_rgba(14,165,233,0.15)] bg-sky-500/[0.02]',
        pink: 'hover:border-pink-500/50 hover:shadow-[0_0_50px_rgba(236,72,153,0.15)] bg-pink-500/[0.02]',
    };

    const iconColors: any = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    };

    return (
        <div className={`group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-700 overflow-hidden ${colors[color]}`}>
            {/* Ambient Background Glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : color === 'sky' ? 'bg-sky-500' : 'bg-pink-500'}`} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${iconColors[color]}`}>
                            Masterclass Available
                        </div>
                     </div>
                     <h3 className="text-2xl font-black italic uppercase italic tracking-tighter text-white/90 group-hover:text-white transition-colors">{title}</h3>
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] font-mono italic">{subtitle}</span>
                </div>
                <div className={`p-4 rounded-2xl border transition-transform group-hover:scale-110 duration-500 ${iconColors[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            
            <div className="relative z-10 h-[120px] overflow-hidden">
                {items.length > 0 ? (
                    <ul className="space-y-4">
                        {items.slice(0, 3).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 text-xs font-medium text-white/50 group-hover:text-white/70 transition-colors italic">
                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full blur-[1px] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${color === 'indigo' ? 'bg-indigo-400' : color === 'purple' ? 'bg-purple-400' : color === 'sky' ? 'bg-sky-400' : 'bg-pink-400'}`} />
                                <span className="leading-tight tracking-tight uppercase tracking-[0.05em]">{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[1.5rem] opacity-30">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">Scanning Range...</span>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Open Protocol</span>
                <div className="flex items-center gap-2 text-indigo-400 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Enter Masterclass</span>
                    <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
    );
}

function AlertCircle({ size, className }: any) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

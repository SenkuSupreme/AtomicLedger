"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, RefreshCw, Loader2, Sparkles, Activity, Target, BrainCircuit, 
    BarChart2, Globe, ChevronRight, ChevronDown, Zap, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Signal {
    label: string;
    status: 'VALID' | 'INVALID' | 'PENDING';
}

interface StrategySetup {
    id: string;
    timestamp: string;
    name: string;
    methodology: 'SMC' | 'ICT' | 'ORB' | 'CRT';
    setup: string;
    logic: string;
    confidence: number;
    entry: number;
    sl: number;
    tp1: number;
    tp2: number;
    explanation: {
        why: string;
        target: string;
        invalidation: string;
        controlTf: string;
        narrative: string;
    };
}

interface TimeframeSMC {
    timeframe: string;
    label: string;
    orderBlocks: any[];
    fairValueGaps: any[];
    trend: string;
}

interface AnalysisResult {
    symbol: string;
    currentPrice: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    probability: number;
    signals: Signal[];
    methodologySignals: {
        smc: Signal[];
        ict: Signal[];
        orb: Signal[];
        crt: Signal[];
    };
    concepts: {
      smc: string[];
      ict: string[];
      orb: string[];
      crt: string[];
    };
    smc_advanced: {
        strategies: StrategySetup[];
        timeframes: TimeframeSMC[];
        overallBias: string;
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

  const fetchAnalysis = async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      // Prioritize Database Sync over local persistence
      const res = await fetch(`/api/insights/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, force })
      });
      if (!res.ok) {
        if (res.status === 503) throw new Error("API Rate Limit. Please wait a moment.");
        throw new Error("Failed to fetch analysis.");
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Institutional link failure.");
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
         <div className="fixed inset-0 pointer-events-none -z-10 bg-[#050505]">
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-horizontal" />
         </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 pb-8 border-b border-white/5 mb-8">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
                        <Button variant="outline" className="relative h-16 w-16 border-white/10 rounded-2xl bg-[#0A0A0A] p-0 hover:bg-white/5 transition-transform hover:scale-105" onClick={() => router.back()}>
                            <ArrowLeft size={28} />
                        </Button>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.5em] italic">System Online // Tracking</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-[-0.06em] text-white italic uppercase leading-none">
                            {symbol} <span className="text-primary/20">/</span> <span className="text-white/20">USD</span>
                        </h1>
                    </div>
                </div>
                
                <div className="md:ml-auto flex items-center gap-4">
                    <Tooltip text="Validate Signal Thesis">
                        <Button 
                            onClick={() => fetchAnalysis(false)}
                            disabled={loading}
                            className="h-14 bg-white/5 border border-white/10 text-white/50 px-8 rounded-xl font-black uppercase tracking-widest gap-3 hover:bg-white/10 transition-all text-[11px]"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Validating...' : 'Refresh'}
                        </Button>
                    </Tooltip>
                    <Tooltip text="Force New Analysis">
                        <Button 
                            onClick={() => fetchAnalysis(true)}
                            disabled={loading}
                            className="h-14 bg-primary text-primary-foreground px-8 rounded-xl font-black uppercase tracking-widest gap-3 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:scale-105 transition-all text-[11px]"
                        >
                            <Zap size={18} />
                            Force Sync
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center">
                    <Loader2 size={64} className="text-primary animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-white/60 uppercase tracking-tighter italic">Forecasting Price Action...</h2>
                </div>
            ) : error ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                    <AlertCircle size={64} className="text-rose-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Analysis Failed</h2>
                    <p className="text-white/40 mt-2 mb-6">{error}</p>
                    <Button onClick={() => fetchAnalysis(true)}>Try Again</Button>
                </div>
            ) : data ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center text-center relative overflow-hidden group">
                           <div className="absolute top-6 left-6 w-12 h-[2px] bg-white/10" />
                           <div className="absolute top-6 left-6 w-[2px] h-12 bg-white/10" />
                           <div className="absolute bottom-6 right-6 w-12 h-[2px] bg-white/10" />
                           <div className="absolute bottom-6 right-6 w-[2px] h-12 bg-white/10" />

                            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] mb-12 italic">Precision Matrix Conv.</h3>
                            
                            <div className="relative mb-12 flex items-center justify-center">
                                <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full" />
                                <motion.div 
                                    className="absolute w-full h-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary blur-sm rounded-full" />
                                </motion.div>

                                <div className="relative z-10">
                                    <span className={`text-8xl font-black tracking-[-0.08em] italic leading-none ${
                                        data?.trend === 'BULLISH' ? 'text-emerald-500' : 
                                        data?.trend === 'BEARISH' ? 'text-rose-500' : 
                                        'text-amber-500'
                                    }`}>
                                        {data?.probability}%
                                    </span>
                                </div>
                            </div>

                            <div className={`px-6 py-2 rounded-full text-[12px] font-black uppercase border mb-16 tracking-[0.4em] italic ${
                                data?.trend === 'BULLISH' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                                data?.trend === 'BEARISH' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
                                'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            }`}>
                                System Bias: {data?.trend}
                            </div>

                            <div className="w-full space-y-6">
                                <div className="flex justify-between items-end">
                                     <div className="text-left">
                                         <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic block mb-1">Mark Price</span>
                                         <div className="text-3xl font-black italic font-mono tracking-tighter text-white">${data?.currentPrice?.toFixed(2)}</div>
                                     </div>
                                      {data?.analyzedAt && (
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic block mb-1">Last Log</span>
                                            <div className="text-xs font-bold text-primary italic uppercase">{new Date(data.analyzedAt).toLocaleTimeString()}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                            <Sparkles size={24} />
                                        </div>
                                        <h4 className="text-[13px] font-black italic text-white/70 uppercase tracking-[0.5em]">Neural Signal Diagnostics</h4>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(data?.methodologySignals?.[(data?.smc_advanced?.strategies?.[0]?.methodology?.toLowerCase() || 'smc') as keyof typeof data.methodologySignals])?.map((sig, i) => (
                                        <div key={i} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                                sig.status === 'VALID' ? 'bg-emerald-500' : 
                                                sig.status === 'INVALID' ? 'bg-rose-500' : 
                                                'bg-amber-500'
                                            }`} />
                                            <span className="text-xs font-black uppercase text-white/80 tracking-widest italic">{sig.label}</span>
                                            <div className={`text-[9px] font-black uppercase italic ${
                                                sig.status === 'VALID' ? 'text-emerald-500/60' : 
                                                sig.status === 'INVALID' ? 'text-rose-500/60' : 
                                                'text-amber-500/60'
                                            }`}>
                                                {sig.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 px-2">
                             <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 italic">Integrated Methodology Protocol</h2>
                             <div className="h-[1px] flex-grow bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {['SMC', 'ICT', 'ORB', 'CRT'].map((method) => (
                                <Link key={method} href={`/analytics/insights/${symbol}/${method.toLowerCase()}`} className="h-full">
                                    <ConceptCard 
                                        title={method} 
                                        subtitle={`${method} Core`}
                                        items={data?.methodologySignals?.[method.toLowerCase() as keyof typeof data.methodologySignals] || []} 
                                        icon={method === 'SMC' ? BrainCircuit : method === 'ICT' ? Target : method === 'ORB' ? Activity : BarChart2}
                                        color={method === 'SMC' ? 'indigo' : method === 'ICT' ? 'purple' : method === 'ORB' ? 'sky' : 'pink'}
                                        score={data?.probability}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <NeuralNarrative data={data} symbol={symbol} />
                </motion.div>
            ) : null}
        </div>
    </div>
  );
}

function ConceptCard({ title, subtitle, items, icon: Icon, color, score }: any) {
    const iconColors: any = {
        indigo: 'text-indigo-400 border-indigo-500/20',
        purple: 'text-purple-400 border-purple-500/20',
        sky: 'text-sky-400 border-sky-500/20',
        pink: 'text-pink-400 border-pink-500/20',
        amber: 'text-amber-400 border-amber-500/20',
    };

    return (
        <div className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 hover:border-primary/30 transition-all duration-500 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border border-white/5 bg-white/[0.02] group-hover:scale-110 transition-transform ${iconColors[color]}`}>
                        <Icon size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white/90 leading-none group-hover:text-primary transition-colors">{title}</h3>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] italic">{subtitle}</span>
                    </div>
                 </div>
            </div>
            <div className="space-y-4 flex-grow relative z-10">
                {items.slice(0, 4).map((sig: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] transition-all">
                        <span className="text-[10px] font-bold text-white/40 uppercase truncate italic">{sig.label}</span>
                        <span className={`text-[8px] font-black uppercase italic ${
                            sig.status === 'VALID' ? 'text-emerald-500/60' : 'text-rose-500/60'
                        }`}>
                            {sig.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DiagnosticStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">{label}</span>
            <div className="text-lg font-black italic tracking-tighter text-white/80 font-mono">{value}</div>
        </div>
    );
}

function NeuralNarrative({ data, symbol }: { data: AnalysisResult, symbol: string }) {
    const [narrative, setNarrative] = useState<string>('');
    const [generating, setGenerating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const currentNarrative = data?.smc_advanced?.strategies?.[0]?.explanation?.narrative;
        if (currentNarrative && currentNarrative.length > 0) {
            setNarrative(currentNarrative);
        } else {
            generateNarrative();
        }
    }, [data]);

    const generateNarrative = async () => {
        setGenerating(true);
        try {
            const bestStrategy = data.smc_advanced.strategies[0];
            const mainTf = data.smc_advanced.timeframes.find(tf => tf.timeframe === '15M') || data.smc_advanced.timeframes[0];
            
            const context = {
                symbol,
                currentPrice: data.currentPrice,
                methodology: bestStrategy.methodology,
                bias: bestStrategy.setup,
                timeframeContext: "4H Bias | 15M Structure | 1/5M Execution",
                entryPrice: bestStrategy.entry,
                stopLoss: bestStrategy.sl,
                tp1: bestStrategy.tp1,
                tp2: bestStrategy.tp2,
                confluenceScore: bestStrategy.confidence,
                htfTrend: data.trend,
                ltfTrend: mainTf.trend,
                methodologyConfluences: {
                    SMC: data.methodologySignals.smc.map(s => `${s.label}: ${s.status}`).join(', '),
                    ICT: data.methodologySignals.ict.map(s => `${s.label}: ${s.status}`).join(', '),
                    ORB: data.methodologySignals.orb.map(s => `${s.label}: ${s.status}`).join(', '),
                    CRT: data.methodologySignals.crt.map(s => `${s.label}: ${s.status}`).join(', ')
                }
            };

            const res = await fetch('/api/ai-narrative', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });

            if (res.ok) {
                const json = await res.json();
                setNarrative(json.narrative);
            } else {
                setNarrative("### FORENSIC LINK INTERRUPT\n\nThe neural engine encountered an anomaly while decrypting market delivery logic.");
            }
        } catch (e) {
            console.error("Narrative generation failed", e);
            setNarrative("### NEURAL SYNC FAILURE\n\nConnection to the institutional core timed out.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="bg-[#0A0A0A] rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group min-h-[120px] flex flex-col justify-start">
             <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors pointer-events-none">
                <BrainCircuit size={160} />
             </div>
             
             <div 
                className="flex items-center justify-between cursor-pointer relative z-10"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/20 rounded-[1.5rem] shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                        <BrainCircuit size={24} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-primary italic mb-1">Neural Narrative Processor</h3>
                        <div className="text-2xl font-black italic uppercase tracking-tighter text-foreground/90 leading-none">
                            Institutional <span className="text-primary/40 text-lg">Logic Decryption</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={generating}
                        onClick={(e) => { e.stopPropagation(); generateNarrative(); }}
                        className="h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 px-6 shadow-xl"
                    >
                        {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-primary" />}
                        {generating ? 'Transmitting...' : 'Decrypt Logic'}
                    </Button>
                    <div className={`p-3 rounded-full border border-white/5 bg-white/5 transition-all duration-500 ${isOpen ? 'rotate-180 bg-primary/20 border-primary/30' : ''}`}>
                        <ChevronDown size={16} className="text-primary/50" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="mt-8 border-t border-white/5 pt-10 relative z-10 w-full">
                    {generating ? (
                        <div className="space-y-4">
                            <div className="h-4 bg-white/5 rounded-full animate-pulse w-full" />
                            <div className="h-4 bg-white/5 rounded-full animate-pulse w-5/6" />
                            <div className="h-4 bg-white/5 rounded-full animate-pulse w-4/6" />
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white/60 text-base leading-[1.8] font-medium max-w-5xl border-l-2 border-primary/20 pl-8 markdown-narrative"
                        >
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-xl font-black italic uppercase tracking-widest text-white mb-4 mt-6 first:mt-0" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-lg font-black italic uppercase tracking-wider text-primary mb-3 mt-8" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-md font-black italic uppercase tracking-wide text-white/90 mb-2 mt-6" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-4 last:mb-0 italic" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-primary/90 font-black not-italic" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-2 mb-4 list-none" {...props} />,
                                    li: ({node, ...props}) => (
                                        <li className="flex items-start gap-2 before:content-['//'] before:text-primary/40 before:font-mono before:text-[10px] before:mt-1" {...props} />
                                    ),
                                }}
                            >
                                {narrative || 'Awaiting forensic synthesis...'}
                            </ReactMarkdown>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {children}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-[9px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap z-[100] pointer-events-none shadow-2xl border border-white/10"
                    >
                        {text}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-foreground" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

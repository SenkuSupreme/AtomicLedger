
'use client';

import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X, Star, Calendar as CalendarIcon, Clock, Link as LinkIcon, Image as ImageIcon, Layout, Activity, BarChart3, ShieldAlert, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatableSelect from './CreatableSelect';
import { usePortfolios } from '@/context/PortfolioContext';
import CreatePortfolioModal from './CreatePortfolioModal';

interface NewTradeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DEFAULT_OPTIONS = {
    SYMBOL_TYPES: ['Forex', 'Crypto', 'CFD', 'Futures', 'Stocks', 'Indices'],
    MARKET_CONDITIONS: [
        'High Volatility', 'Low Volatility', 'News-driven spike', 'Strong uptrend(HTF)', 
        'Sideways(HTF)', 'Strong uptrend(LTF)', 'Sideways(LTF)', 'Consolidation Before Reversal', 
        'Economic News Impact', 'Pullback in downtrend', 'Pullback in uptrend', 
        'Strong Downtrend(HTF)', 'Strong Downtrend(LTF)', 'Strong Uptrend (HTF)', 
        'Strong Uptrend (LTF)', 'Slowing Momentum', 'Consolidation before Breakout'
    ],
    TRADE_TYPES: ['Scalping', 'Day Trade', 'Swing Trade', 'Positional Trade'],
    TIMEFRAMES: ['1M', '3M', '5M', '10M', '15M', '30M', '1H', '4H', '1D'],
    SESSIONS: ['Asia', 'London', 'New York', 'Asia London Overlap', 'London New York Overlap'],
    ENTRY_SIGNALS: ['Candle Confirmation', 'FVG', 'IFVG'],
    CONFLUENCES: ['SMT Divergence', 'Aligned with Seasonal', 'HTF trend Alignment', 'MTF confirmation', 'LTF entry'],
    KEY_LEVELS: ['OB', 'FVG', 'Supply Zone', 'POI', 'AOI', 'Demand Zone'],
    SL_MANAGEMENT: [
        'Locked Profit', 'Pre-News Tightening', 'Delayed SL Placement', 'Moved to BE', 
        'Removed SL', 'Partial SL adjustment', 'Initial SL maintained', 'Hit Trailed SL', 
        'Hit Initial SL', 'Widned SL'
    ],
    TP_MANAGEMENT: [
        'Final TP Hit', 'Partial 1R taken', 'Partial 2 Taken', 'Partial 3 Taken', 
        'Let Runners Run', 'Manual Close(Profit)', 'Manual Close (LOSS)', 
        'Manual Close (BE)', 'Pre-News Exit', 'Setup Invalidated'
    ],
    OUTCOMES: ['Win', 'Loss', 'BE', 'Small Win', 'Big Win', 'Big Loss']
};

type TabId = 'basic' | 'analysis' | 'execution' | 'risk' | 'results';

export default function NewTradeDialog({ isOpen, onClose, onSuccess }: NewTradeDialogProps) {
    const { portfolios, refreshPortfolios } = usePortfolios();
    const [activeTab, setActiveTab] = useState<TabId>('basic');
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strategies, setStrategies] = useState<any[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const [availableOptions, setAvailableOptions] = useState(DEFAULT_OPTIONS);

    const handleAddOption = (key: keyof typeof DEFAULT_OPTIONS, val: string) => {
        setAvailableOptions(prev => ({
            ...prev,
            [key]: [...prev[key], val]
        }));
    };

    const handleDeleteOption = (key: keyof typeof DEFAULT_OPTIONS, val: string) => {
        setAvailableOptions(prev => ({
            ...prev,
            [key]: prev[key].filter(opt => opt !== val)
        }));
    };

    const [form, setForm] = useState<any>({
        // Basic
        symbol: '',
        assetType: 'forex',
        portfolioId: 'all',
        strategyId: '',
        status: 'Closed',
        timestampEntry: new Date().toISOString().slice(0, 16),
        timestampExit: '',
        direction: 'long',
        
        // Analysis
        newsImpact: 'None',
        dailyBias: '',
        marketCondition: [],
        tradeType: '',
        entryTimeframe: '',
        sessions: [],
        entrySignal: [],
        confluences: [],
        keyLevels: [],
        
        // Execution
        orderType: 'Market',
        entryPrice: '',
        exitPrice: '',
        quantity: '1',
        stopLoss: '',
        stopLossUnit: '$',
        riskPercentage: '',
        
        // Risk
        slManagement: [],
        targetRR: '',
        actualRR: '',
        maxRR: '',
        tpManagement: [],
        
        // Results
        grossPnl: '',
        fees: '0',
        pnl: '',
        pnlUnit: '$',
        outcome: '',
        setupGrade: 3,
        mistakes: '',
        description: '',
        noteToSelf: '',
        screenshots: [],
        chartLink: ''
    });

    useEffect(() => {
        fetch('/api/strategies')
            .then(res => res.json())
            .then(data => setStrategies(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeTab]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...form,
                entryPrice: Number(form.entryPrice),
                exitPrice: Number(form.exitPrice),
                quantity: Number(form.quantity),
                pnl: Number(form.pnl),
                grossPnl: Number(form.grossPnl),
                fees: Number(form.fees),
                setupGrade: Number(form.setupGrade),
                targetRR: Number(form.targetRR),
                actualRR: Number(form.actualRR),
                maxRR: Number(form.maxRR),
                riskPercentage: Number(form.riskPercentage)
            };

            // Remove portfolioId if it's 'all'
            if (payload.portfolioId === 'all') {
                delete payload.portfolioId;
            }

            const res = await fetch('/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic', icon: Layout },
        { id: 'analysis', label: 'Analysis', icon: Activity },
        { id: 'execution', label: 'Execution', icon: BarChart3 },
        { id: 'risk', label: 'Risk', icon: ShieldAlert },
        { id: 'results', label: 'Results', icon: CheckCircle2 },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 bg-[#050505] border-white/10 text-white rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,0,0,1)]">
                <DialogHeader className="px-10 py-4 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="max-w-xl">
                            <DialogTitle className="text-2xl font-black tracking-tight">Trade Documentation</DialogTitle>
                            <DialogDescription className="text-white/60 font-mono text-[10px] uppercase tracking-[0.25em] mt-1.5">
                                Institutional Grade Journaling
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="flex px-10 border-b border-white/5 bg-white/[0.01] flex-shrink-0 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabId)}
                            className={`flex items-center gap-2.5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white/60'}`}
                        >
                            <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="active-trade-tab"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.8)] z-10"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-12"
                >
                    <div className="min-h-[500px]">
                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <div className="max-w-3xl mx-auto space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Symbol Identification</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1 group">
                                            <Input 
                                                placeholder="e.g. EURUSD" 
                                                value={form.symbol}
                                                onChange={(e) => setForm({...form, symbol: e.target.value})}
                                                className="bg-zinc-900/60 border-white/10 h-16 pl-12 rounded-2xl focus:ring-1 ring-sky-500/50 text-base transition-all group-focus-within:bg-zinc-900/80 placeholder:text-white/40"
                                            />
                                            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-sky-500/80 transition-colors" />
                                        </div>
                                        <select 
                                            className="bg-zinc-900/60 border border-white/10 rounded-2xl px-8 h-16 text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-sky-500/50 transition-all cursor-pointer hover:bg-zinc-900/80"
                                            value={form.assetType}
                                            onChange={(e) => setForm({...form, assetType: e.target.value})}
                                        >
                                            {DEFAULT_OPTIONS.SYMBOL_TYPES.map(t => <option key={t} value={t.toLowerCase()} className="bg-[#0a0a0a]">{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Portfolio Allocation</label>
                                    <div className="flex gap-4">
                                        <select 
                                            className="flex-1 bg-zinc-900/60 border border-white/10 rounded-2xl px-6 h-16 text-sm font-medium outline-none focus:border-sky-500/50 transition-all cursor-pointer hover:bg-zinc-900/80"
                                            value={form.portfolioId}
                                            onChange={(e) => setForm({...form, portfolioId: e.target.value})}
                                        >
                                            <option value="all" className="bg-[#0a0a0a]">Default Trading Portfolio</option>
                                            {portfolios.map(p => <option key={p._id} value={p._id} className="bg-[#0a0a0a]">{p.name}</option>)}
                                        </select>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="h-16 w-16 p-0 border-white/10 bg-zinc-900/60 hover:bg-zinc-800 rounded-2xl transition-all"
                                            onClick={() => setIsPortfolioModalOpen(true)}
                                        >
                                            <Plus size={24} className="text-white/60" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Operational Strategy</label>
                                    <select 
                                        className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl px-6 h-16 text-sm font-medium outline-none focus:border-sky-500/50 transition-all cursor-pointer hover:bg-zinc-900/80"
                                        value={form.strategyId}
                                        onChange={(e) => setForm({...form, strategyId: e.target.value})}
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Select Strategy Architecture...</option>
                                        {strategies.map(s => <option key={s._id} value={s._id} className="bg-[#0a0a0a]">{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Trade Lifecycle</label>
                                    <div className="flex gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-2xl h-16">
                                        {['Open', 'Closed', 'Pending'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setForm({...form, status: s})}
                                                className={`flex-1 text-[11px] font-black uppercase rounded-xl transition-all ${form.status === s ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/70 hover:text-white/60'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Market Exposure</label>
                                    <div className="flex gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-2xl h-16">
                                        <button
                                            onClick={() => setForm({...form, direction: 'long'})}
                                            className={`flex-1 text-[11px] font-black uppercase rounded-xl transition-all ${form.direction === 'long' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/70 hover:text-emerald-500/60'}`}
                                        >
                                            LONG
                                        </button>
                                        <button
                                            onClick={() => setForm({...form, direction: 'short'})}
                                            className={`flex-1 text-[11px] font-black uppercase rounded-xl transition-all ${form.direction === 'short' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-white/70 hover:text-rose-500/60'}`}
                                        >
                                            SHORT
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Execution Timeline</label>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="relative group bg-zinc-900/60 rounded-3xl p-1 border border-white/10 focus-within:border-sky-500/40 transition-all">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                <CalendarIcon size={20} className="text-sky-500/60" />
                                                <div className="w-[1px] h-4 bg-white/20" />
                                                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Entry</span>
                                            </div>
                                            <Input 
                                                type="datetime-local" 
                                                value={form.timestampEntry}
                                                onChange={(e) => setForm({...form, timestampEntry: e.target.value})}
                                                className="bg-transparent border-none h-16 pl-32 pr-6 focus:ring-0 appearance-none text-base font-semibold"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                        </div>
                                        <div className="relative group bg-zinc-900/60 rounded-3xl p-1 border border-white/10 focus-within:border-orange-500/40 transition-all">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                <Clock size={20} className="text-orange-500/60" />
                                                <div className="w-[1px] h-4 bg-white/20" />
                                                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Exit</span>
                                            </div>
                                            <Input 
                                                type="datetime-local" 
                                                value={form.timestampExit}
                                                onChange={(e) => setForm({...form, timestampExit: e.target.value})}
                                                className="bg-transparent border-none h-16 pl-32 pr-6 focus:ring-0 appearance-none text-base font-semibold"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Macro News Intensity</label>
                                <div className="flex gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-3xl h-20">
                                    {['Low', 'Medium', 'High'].map(i => (
                                        <button
                                            key={i}
                                            onClick={() => setForm({...form, newsImpact: form.newsImpact === i ? 'None' : i})}
                                            className={`flex-1 text-[11px] font-black uppercase rounded-2xl transition-all ${form.newsImpact === i ? (i === 'High' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : i === 'Medium' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]') : 'text-white/70 hover:text-white/60'}`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">HTF Contextual Bias</label>
                                <CreatableSelect 
                                    options={['Bullish', 'Bearish', 'Bullish Ranging', 'Bearish Ranging']}
                                    selected={form.dailyBias}
                                    onChange={(val) => setForm({...form, dailyBias: val})}
                                    placeholder="Select bias..."
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Market Environment</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.MARKET_CONDITIONS}
                                    selected={form.marketCondition}
                                    onChange={(val) => setForm({...form, marketCondition: val})}
                                    onAdd={(val) => handleAddOption('MARKET_CONDITIONS', val)}
                                    onDelete={(val) => handleDeleteOption('MARKET_CONDITIONS', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Execution Archetype</label>
                                <CreatableSelect 
                                    options={availableOptions.TRADE_TYPES}
                                    selected={form.tradeType}
                                    onChange={(val) => setForm({...form, tradeType: val})}
                                    onAdd={(val) => handleAddOption('TRADE_TYPES', val)}
                                    onDelete={(val) => handleDeleteOption('TRADE_TYPES', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Active Session Corridor</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.SESSIONS}
                                    selected={form.sessions}
                                    onChange={(val) => setForm({...form, sessions: val})}
                                    onAdd={(val) => handleAddOption('SESSIONS', val)}
                                    onDelete={(val) => handleDeleteOption('SESSIONS', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Core Signal Trigger</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.ENTRY_SIGNALS}
                                    selected={form.entrySignal}
                                    onChange={(val) => setForm({...form, entrySignal: val})}
                                    onAdd={(val) => handleAddOption('ENTRY_SIGNALS', val)}
                                    onDelete={(val) => handleDeleteOption('ENTRY_SIGNALS', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Technical Confluences</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.CONFLUENCES}
                                    selected={form.confluences}
                                    onChange={(val) => setForm({...form, confluences: val})}
                                    onAdd={(val) => handleAddOption('CONFLUENCES', val)}
                                    onDelete={(val) => handleDeleteOption('CONFLUENCES', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Liquidity & Supply/Demand Levels</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.KEY_LEVELS}
                                    selected={form.keyLevels}
                                    onChange={(val) => setForm({...form, keyLevels: val})}
                                    onAdd={(val) => handleAddOption('KEY_LEVELS', val)}
                                    onDelete={(val) => handleDeleteOption('KEY_LEVELS', val)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Execution Tab */}
                    {activeTab === 'execution' && (
                        <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="space-y-6">
                                 <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Order Execution Protocol</label>
                                 <div className="flex gap-2 p-1.5 bg-zinc-900/60 border border-white/5 rounded-3xl h-16">
                                     {['Market', 'Limit', 'Stop'].map(t => (
                                         <button
                                             key={t}
                                             onClick={() => setForm({...form, orderType: t})}
                                             className={`flex-1 text-[10px] font-black uppercase rounded-2xl transition-all ${form.orderType === t ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/40 hover:text-white/70'}`}
                                         >
                                             {t}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             <div className="space-y-6">
                                 <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Entry Price Points</label>
                                 <Input 
                                     type="number"
                                     value={form.entryPrice}
                                     onChange={(e) => setForm({...form, entryPrice: e.target.value})}
                                     className="bg-zinc-900/40 border-white/5 h-14 rounded-2xl px-8 text-base focus:ring-1 ring-sky-500/30"
                                     placeholder="0.00000"
                                 />
                             </div>

                             <div className="space-y-6">
                                 <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Exit Settlement Price</label>
                                 <Input 
                                     type="number"
                                     value={form.exitPrice}
                                     onChange={(e) => setForm({...form, exitPrice: e.target.value})}
                                     className="bg-zinc-900/40 border-white/5 h-14 rounded-2xl px-8 text-base focus:ring-1 ring-sky-500/30"
                                     placeholder="0.00000"
                                 />
                             </div>

                             <div className="space-y-6">
                                 <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Position Sizing (Lots)</label>
                                 <Input 
                                     type="number"
                                     value={form.quantity}
                                     onChange={(e) => setForm({...form, quantity: e.target.value})}
                                     className="bg-zinc-900/40 border-white/5 h-14 rounded-2xl px-8 text-base focus:ring-1 ring-sky-500/30"
                                     placeholder="1.00"
                                 />
                             </div>

                             <div className="space-y-4">
                                 <div className="flex justify-between items-end">
                                     <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">Stop Loss Parameters</label>
                                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest bg-white/[0.02] px-3 py-1 rounded-full border border-white/5">Units Toggleable [$ / Pips]</span>
                                 </div>
                                 <div className="flex gap-4">
                                     <Input 
                                         type="number"
                                         value={form.stopLoss}
                                         onChange={(e) => setForm({...form, stopLoss: e.target.value})}
                                         className="bg-zinc-900/40 border-white/5 h-14 rounded-2xl px-8 flex-1 text-base focus:ring-1 ring-sky-500/30"
                                         placeholder="0.0"
                                     />
                                     <button 
                                         onClick={() => setForm({...form, stopLossUnit: form.stopLossUnit === '$' ? 'pips' : '$'})}
                                         className={`px-6 h-14 rounded-2xl text-[10px] font-black transition-all border ${form.stopLossUnit === '$' ? 'bg-sky-500/10 border-sky-500/30 text-sky-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'}`}
                                     >
                                         IN {form.stopLossUnit.toUpperCase()}
                                     </button>
                                 </div>
                             </div>

                             <div className="space-y-6">
                                 <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Allocated Account Risk %</label>
                                 <Input 
                                     type="number"
                                     value={form.riskPercentage}
                                     onChange={(e) => setForm({...form, riskPercentage: e.target.value})}
                                     className="bg-zinc-900/40 border-white/5 h-14 rounded-2xl px-8 text-base focus:ring-1 ring-sky-500/30"
                                     placeholder="1.0"
                                 />
                             </div>
                        </div>
                    )}

                    {/* Risk Tab */}
                    {activeTab === 'risk' && (
                        <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Active SL Management</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.SL_MANAGEMENT}
                                    selected={form.slManagement}
                                    onChange={(val) => setForm({...form, slManagement: val})}
                                    onAdd={(val) => handleAddOption('SL_MANAGEMENT', val)}
                                    onDelete={(val) => handleDeleteOption('SL_MANAGEMENT', val)}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">TP Distribution Strategy</label>
                                <CreatableSelect 
                                    multi
                                    options={availableOptions.TP_MANAGEMENT}
                                    selected={form.tpManagement}
                                    onChange={(val) => setForm({...form, tpManagement: val})}
                                    onAdd={(val) => handleAddOption('TP_MANAGEMENT', val)}
                                    onDelete={(val) => handleDeleteOption('TP_MANAGEMENT', val)}
                                />
                            </div>

                            <div className="space-y-12">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Risk-To-Reward Intel</label>
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="flex items-center gap-12 bg-zinc-900/60 p-12 rounded-[3rem] border border-white/10 shadow-3xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-sky-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1 space-y-4 relative z-10">
                                            <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Target RR</span>
                                            <Input 
                                                type="number"
                                                value={form.targetRR}
                                                onChange={(e) => setForm({...form, targetRR: e.target.value})}
                                                className="bg-transparent border-none p-0 h-auto text-6xl font-black text-sky-400 focus:ring-0 placeholder:text-sky-500/10"
                                                placeholder="0.0"
                                            />
                                        </div>
                                        <div className="w-[1px] h-24 bg-white/30" />
                                        <div className="flex-1 space-y-4 relative z-10">
                                            <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Actual RR</span>
                                            <Input 
                                                type="number"
                                                value={form.actualRR}
                                                onChange={(e) => setForm({...form, actualRR: e.target.value})}
                                                className="bg-transparent border-none p-0 h-auto text-6xl font-black text-emerald-400 focus:ring-0 placeholder:text-emerald-500/10"
                                                placeholder="0.0"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/60 p-12 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center space-y-6 shadow-3xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-amber-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em] relative z-10">Peak Potential (Max RR)</span>
                                        <Input 
                                            type="number"
                                            value={form.maxRR}
                                            onChange={(e) => setForm({...form, maxRR: e.target.value})}
                                            className="bg-transparent border-none p-0 h-auto text-9xl font-black text-amber-400 focus:ring-0 text-center placeholder:text-amber-500/20 relative z-10"
                                            placeholder="0.0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="space-y-10">
                                <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block text-center">Final P&L Reconciliation</label>
                                <div className="max-w-2xl mx-auto space-y-8">
                                    <div className="bg-zinc-900/60 p-10 rounded-[3rem] border border-white/10 space-y-5 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block relative z-10">Gross Yield</span>
                                        <Input 
                                            type="number"
                                            value={form.grossPnl}
                                            onChange={(e) => setForm({...form, grossPnl: e.target.value})}
                                            className="bg-transparent border-none p-0 h-auto text-5xl font-black text-white focus:ring-0 relative z-10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-zinc-900/60 p-10 rounded-[3rem] border border-white/10 space-y-5 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-rose-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block relative z-10">Transaction Fees</span>
                                        <Input 
                                            type="number"
                                            value={form.fees}
                                            onChange={(e) => setForm({...form, fees: e.target.value})}
                                            className="bg-transparent border-none p-0 h-auto text-5xl font-black text-rose-500/60 focus:ring-0 relative z-10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="bg-zinc-900/60 p-12 rounded-[3.5rem] border border-emerald-500/20 space-y-6 shadow-3xl ring-2 ring-emerald-500/10 bg-emerald-500/[0.03] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-50" />
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-xs font-black text-emerald-500/70 uppercase tracking-[0.25em]">Net Realized P&L</span>
                                            <button 
                                                onClick={() => setForm({...form, pnlUnit: form.pnlUnit === '$' ? 'pips' : '$'})}
                                                className="px-4 py-2 bg-emerald-500/10 rounded-full text-xs font-black text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                                            >
                                                {form.pnlUnit.toUpperCase()}
                                            </button>
                                        </div>
                                        <Input 
                                            type="number"
                                            value={form.pnl}
                                            onChange={(e) => setForm({...form, pnl: e.target.value})}
                                            className="bg-transparent border-none p-0 h-auto text-7xl font-black text-emerald-500 focus:ring-0 relative z-10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="max-w-2xl mx-auto space-y-12">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Trade Resolution</label>
                                    <CreatableSelect 
                                        options={availableOptions.OUTCOMES}
                                        selected={form.outcome}
                                        onChange={(val) => setForm({...form, outcome: val})}
                                        onAdd={(val) => handleAddOption('OUTCOMES', val)}
                                        onDelete={(val) => handleDeleteOption('OUTCOMES', val)}
                                    />
                                </div>
                                <div className="space-y-8">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Execution Quality Score</label>
                                    <div className="flex gap-8">
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                key={star}
                                                onClick={() => setForm({...form, setupGrade: star})}
                                                className={`group transition-all relative ${form.setupGrade >= star ? 'text-amber-400 scale-110' : 'text-white/30 hover:text-white/60'}`}
                                            >
                                                <Star size={36} fill={form.setupGrade >= star ? 'currentColor' : 'none'} strokeWidth={1} />
                                                <span className={`block text-[10px] mt-2 text-center font-black uppercase tracking-tighter ${form.setupGrade === star ? 'text-amber-400' : 'text-transparent group-hover:text-white/40'}`}>
                                                    {star === 5 ? 'A+' : star === 4 ? 'A' : star === 3 ? 'B' : star === 2 ? 'C' : 'D'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Behavioral Analysis (Mistakes)</label>
                                    <textarea 
                                        className="w-full bg-zinc-900/40 border border-white/5 rounded-3xl p-8 text-base outline-none focus:ring-1 ring-white/10 h-40 resize-none transition-all placeholder:text-white/30"
                                        value={form.mistakes}
                                        onChange={(e) => setForm({...form, mistakes: e.target.value})}
                                        placeholder="Document any deviations from your trading plan..."
                                    />
                                </div>
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Narrative Description</label>
                                    <textarea 
                                        className="w-full bg-zinc-900/40 border border-white/5 rounded-3xl p-8 text-base outline-none focus:ring-1 ring-white/10 h-40 resize-none transition-all placeholder:text-white/30"
                                        value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        placeholder="Standard narrative of price action and emotional state..."
                                    />
                                </div>
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Strategic Review (Note to Self)</label>
                                    <textarea 
                                        className="w-full bg-zinc-900/40 border border-white/5 rounded-3xl p-8 text-base outline-none focus:ring-1 ring-white/10 h-40 resize-none transition-all placeholder:text-white/30"
                                        value={form.noteToSelf}
                                        onChange={(e) => setForm({...form, noteToSelf: e.target.value})}
                                        placeholder="What is the one lesson to take from this execution?"
                                    />
                                </div>
                             </div>

                             <div className="max-w-2xl mx-auto space-y-8 pt-12 border-t border-white/5">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Evidence (Chart URL)</label>
                                    <div className="relative group">
                                        <Input 
                                            value={form.chartLink}
                                            onChange={(e) => setForm({...form, chartLink: e.target.value})}
                                            className="bg-zinc-900/40 border-white/5 h-14 pl-14 rounded-2xl text-sm focus:ring-1 ring-sky-500/30"
                                            placeholder="Paste TradingView / Cleanshot URL..."
                                        />
                                        <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sky-500/60 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/70 uppercase tracking-[0.2em] block">Visual Documentation</label>
                                    <button className="w-full bg-white/[0.01] border border-dashed border-white/10 rounded-2xl h-14 flex items-center justify-center gap-3 text-xs font-bold text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all">
                                        <ImageIcon size={18} className="opacity-50" />
                                        Upload Static Assets (Locked)
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-between items-center flex-shrink-0">
                    <div className="flex gap-2">
                        {tabs.map((tab, i) => (
                            <div key={tab.id} className={`w-2 h-2 rounded-full ${tabs.findIndex(t => t.id === activeTab) >= i ? 'bg-white' : 'bg-white/30'}`} />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="text-white/70 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        {activeTab !== 'results' ? (
                            <Button 
                                onClick={() => {
                                    const nextIdx = tabs.findIndex(t => t.id === activeTab) + 1;
                                    setActiveTab(tabs[nextIdx].id as TabId);
                                }}
                                className="bg-white text-black hover:bg-gray-200 px-8 font-bold"
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-blue-600 text-white hover:bg-blue-700 px-8 font-bold shadow-xl shadow-blue-500/20"
                            >
                                {loading ? 'Saving...' : 'Commit to Journal'}
                            </Button>
                        )}
                    </div>
                </div>

                <CreatePortfolioModal 
                    isOpen={isPortfolioModalOpen}
                    onClose={() => setIsPortfolioModalOpen(false)}
                    onSuccess={(p) => {
                        refreshPortfolios();
                        setForm({...form, portfolioId: p._id});
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}


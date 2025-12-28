
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Layout, 
    Target, 
    Shield, 
    Zap, 
    BookOpen, 
    MoreHorizontal, 
    Plus, 
    Image as ImageIcon,
    Trash2,
    Move,
    RotateCw,
    Maximize2,
    ChevronDown,
    ChevronUp,
    ListChecks,
    Globe,
    Briefcase,
    Clock,
    Flame,
    Compass,
    Settings,
    FileText,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InstitutionalCanvas from './InstitutionalCanvas';

// --- TYPES ---
interface CanvasElement {
    id: string;
    type: 'image' | 'note';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
}

interface CustomSection {
    id?: string;
    title: string;
    content: string;
}

interface StrategyData {
    _id?: string; isTemplate?: boolean;
    name: string;
    coreInfo: {
        marketFocus: string[];
        instrumentFocus: string[];
        htfBias: string;
        executionTimeframe: string;
        confirmationTimeframe: string;
    };
    market: {
        biasFramework: string;
        bestSessions: string[];
        keyConditions: string;
    };
    setup: {
        setupName: string;
        entrySignal: string;
        confluences: string[];
        slPlacement: string;
        tpManagement: string;
    };
    execution: {
        checklist: string[];
        executionStyle: string;
        slManagement: string;
        tpManagement: string;
    };
    risk: {
        riskStrategy: string;
        generalRisk: string;
        conditionsToAvoid: string[];
    };
    additionals: {
        goals: string;
        scenarios: string;
        improvements: string;
        notes: string;
        links: string[];
        books: string[];
    };
    customSections: CustomSection[];
    canvasElements: CanvasElement[];
}

// --- INITIAL STATE ---
const initialData: StrategyData = {
    name: "New Strategy", isTemplate: false,
    coreInfo: { marketFocus: [], instrumentFocus: [], htfBias: "", executionTimeframe: "", confirmationTimeframe: "" },
    market: { biasFramework: "", bestSessions: [], keyConditions: "" },
    setup: { setupName: "", entrySignal: "", confluences: [], slPlacement: "", tpManagement: "" },
    execution: { checklist: [], executionStyle: "Market", slManagement: "", tpManagement: "" },
    risk: { riskStrategy: "", generalRisk: "", conditionsToAvoid: [] },
    additionals: { goals: "", scenarios: "", improvements: "", notes: "", links: [], books: [] },
    customSections: [],
    canvasElements: []
};

// --- COMPONENTS ---

const Section = ({ title, icon: Icon, children, color = "text-sky-400", onRemove }: any) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-white/5 py-10 first:pt-0 last:border-none group/section">
            <div className="flex items-center gap-3 mb-8 group w-full text-left">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-4 flex-1"
                >
                    <div className={`p-2.5 rounded-xl bg-white/[0.08] ${color} border border-white/10 shadow-lg`}>
                        <Icon size={20} />
                    </div>
                    <h3 className="text-[13px] font-black uppercase tracking-[0.25em] text-white group-hover:text-white transition-colors">
                        {title}
                    </h3>
                    {isOpen ? <ChevronUp size={16} className="text-white/70" /> : <ChevronDown size={16} className="text-white/70" />}
                </button>
                {onRemove && (
                    <button 
                        onClick={onRemove}
                        className="opacity-0 group-hover/section:opacity-100 p-2 text-rose-500/70 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-lg"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pl-14 space-y-10">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EditableField = ({ label, value, onChange, placeholder, type = "text", multiline = false }: any) => (
    <div className="space-y-3 group">
        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-white/80 group-focus-within:text-sky-400 transition-colors">
            {label}
        </label>
        {multiline ? (
            <textarea 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none p-0 text-[15px] text-white focus:ring-0 resize-none min-h-[50px] placeholder:text-white/10 leading-relaxed font-medium"
            />
        ) : (
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none p-0 text-[15px] text-white focus:ring-0 placeholder:text-white/10 font-bold"
            />
        )}
    </div>
);

const TagInput = ({ label, tags, onAdd, onRemove }: any) => (
    <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-white/80">{label}</label>
        <div className="flex flex-wrap gap-2.5">
            {tags.map((tag: string, i: number) => (
                <span key={i} className="px-4 py-1.5 bg-white/[0.05] border border-white/10 rounded-xl text-[11px] font-bold text-white flex items-center gap-2.5 group hover:border-sky-400/50 transition-all shadow-sm">
                    {tag}
                    <button onClick={() => onRemove(i)} className="text-white/80 hover:text-rose-500 transition-colors"><Plus size={14} className="rotate-45" /></button>
                </span>
            ))}
            <input 
                className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 text-[11px] text-white/80 focus:ring-0 focus:border-sky-400/30 placeholder:text-white/10 w-32 transition-all outline-none"
                placeholder="Add Requirement +"
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter' && e.target.value) {
                        onAdd(e.target.value);
                        e.target.value = '';
                    }
                }}
            />
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function NotionStrategyEditor({ strategyId, onBack }: { strategyId?: string, onBack: () => void }) {
    const [data, setData] = useState<StrategyData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('editor'); // 'editor' | 'canvas'

    useEffect(() => {
        if (strategyId) {
            fetch(`/api/strategies?id=${strategyId}`)
                .then(res => res.json())
                .then(data => {
                    // Ensure customSections is always an array
                    setData({
                        ...data,
                        customSections: data.customSections || []
                    });
                });
        }
    }, [strategyId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/strategies', {
                method: data._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const updated = await res.json();
            setData(updated);
            alert('Institutional Playbook Synced');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const addCustomSection = () => {
        const title = prompt("Section Title?");
        if (!title) return;
        setData({
            ...data,
            customSections: [
                ...data.customSections,
                { title, content: "" }
            ]
        });
    };

    const removeCustomSection = (index: number) => {
        const newSections = [...data.customSections];
        newSections.splice(index, 1);
        setData({ ...data, customSections: newSections });
    };

    const updateCustomSection = (index: number, content: string) => {
        const newSections = [...data.customSections];
        newSections[index].content = content;
        setData({ ...data, customSections: newSections });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-sky-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-3xl border-b border-white/10 px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <button onClick={onBack} className="p-3 hover:bg-white/[0.08] rounded-2xl text-white/80 hover:text-white transition-all border border-transparent hover:border-white/10">
                        <Maximize2 size={20} className="rotate-45" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <input 
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="bg-transparent border-none p-0 text-4xl font-black placeholder:text-white/40 focus:ring-0 w-[500px] tracking-tight"
                        placeholder="Untitled Strategy"
                    />
                    <button 
                        onClick={() => setData({ ...data, isTemplate: !data.isTemplate })}
                        className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${data.isTemplate ? "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`}
                        title={data.isTemplate ? "Stored as Blueprint" : "Mark as Blueprint"}
                    >
                        <Sparkles size={16} className={data.isTemplate ? "animate-pulse" : ""} />
                        {data.isTemplate ? "Institutional Blueprint" : "Strategy Mode"}
                    </button>

                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
                        <button 
                            onClick={() => setActiveSection('editor')}
                            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeSection === 'editor' ? 'bg-white/10 text-white shadow-2xl' : 'text-white/70 hover:text-white/80'}`}
                        >
                            Blueprint
                        </button>
                        <button 
                            onClick={() => setActiveSection('canvas')}
                            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeSection === 'canvas' ? 'bg-white/10 text-white shadow-2xl' : 'text-white/70 hover:text-white/80'}`}
                        >
                            Visuals
                        </button>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl shadow-sky-500/20 active:scale-95"
                    >
                        {isSaving ? 'Synching...' : 'Store System'}
                    </button>
                </div>
            </header>

            <main className={`${activeSection === 'canvas' ? 'max-w-7xl' : 'max-w-5xl'} mx-auto px-16 py-20`}>
                {activeSection === 'editor' ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <Section title="Institutional Core" icon={Layout} color="text-sky-400">
                            <div className="grid grid-cols-2 gap-16">
                                <TagInput 
                                    label="Market Focus" 
                                    tags={data.coreInfo.marketFocus} 
                                    onAdd={(t: string) => setData({ ...data, coreInfo: { ...data.coreInfo, marketFocus: [...data.coreInfo.marketFocus, t] } })}
                                    onRemove={(i: number) => setData({ ...data, coreInfo: { ...data.coreInfo, marketFocus: data.coreInfo.marketFocus.filter((_, idx) => idx !== i) } })}
                                />
                                <TagInput 
                                    label="Instrument Focus" 
                                    tags={data.coreInfo.instrumentFocus} 
                                    onAdd={(t: string) => setData({ ...data, coreInfo: { ...data.coreInfo, instrumentFocus: [...data.coreInfo.instrumentFocus, t] } })}
                                    onRemove={(i: number) => setData({ ...data, coreInfo: { ...data.coreInfo, instrumentFocus: data.coreInfo.instrumentFocus.filter((_, idx) => idx !== i) } })}
                                />
                                <EditableField label="HTF Bias Framework" value={data.coreInfo.htfBias} onChange={(v: string) => setData({...data, coreInfo: {...data.coreInfo, htfBias: v}})} placeholder="How do you identify the primary trend?" />
                                <div className="grid grid-cols-2 gap-8">
                                    <EditableField label="Execution TF" value={data.coreInfo.executionTimeframe} onChange={(v: string) => setData({...data, coreInfo: {...data.coreInfo, executionTimeframe: v}})} placeholder="5m / 15m" />
                                    <EditableField label="Confirmation TF" value={data.coreInfo.confirmationTimeframe} onChange={(v: string) => setData({...data, coreInfo: {...data.coreInfo, confirmationTimeframe: v}})} placeholder="1m / 5m" />
                                </div>
                            </div>
                        </Section>

                        <Section title="Market Dynamics" icon={Globe} color="text-emerald-400">
                            <div className="space-y-10">
                                <EditableField label="Bias Determination" value={data.market.biasFramework} onChange={(v: string) => setData({...data, market: { ...data.market, biasFramework: v }})} placeholder="e.g. Daily FVG Break + Liquidity Sweep" multiline />
                                <TagInput 
                                    label="Session Optimization" 
                                    tags={data.market.bestSessions} 
                                    onAdd={(t: string) => setData({ ...data, market: { ...data.market, bestSessions: [...data.market.bestSessions, t] } })}
                                    onRemove={(i: number) => setData({ ...data, market: { ...data.market, bestSessions: data.market.bestSessions.filter((_, idx) => idx !== i) } })}
                                />
                                <EditableField label="High-Probability Context" value={data.market.keyConditions} onChange={(v: string) => setData({...data, market: { ...data.market, keyConditions: v }})} placeholder="When does this strategy perform best?" multiline />
                            </div>
                        </Section>

                        <Section title="Technical Setup" icon={Zap} color="text-amber-400">
                            <div className="grid grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <EditableField label="Setup Architecture" value={data.setup.setupName} onChange={(v: string) => setData({...data, setup: { ...data.setup, setupName: v }})} placeholder="e.g. MSS + Displacement" />
                                    <EditableField label="The Trigger" value={data.setup.entrySignal} onChange={(v: string) => setData({...data, setup: { ...data.setup, entrySignal: v }})} placeholder="Exact entry candle criteria" />
                                </div>
                                <div className="space-y-10">
                                    <TagInput 
                                        label="Technical Confluences" 
                                        tags={data.setup.confluences} 
                                        onAdd={(t: string) => setData({ ...data, setup: { ...data.setup, confluences: [...data.setup.confluences, t] } })}
                                        onRemove={(i: number) => setData({ ...data, setup: { ...data.setup, confluences: data.setup.confluences.filter((_, idx) => idx !== i) } })}
                                    />
                                    <div className="grid grid-cols-2 gap-8">
                                        <EditableField label="Stop Placement" value={data.setup.slPlacement} onChange={(v: string) => setData({...data, setup: { ...data.setup, slPlacement: v }})} placeholder="Invalidation Point" />
                                        <EditableField label="TP Logic" value={data.setup.tpManagement} onChange={(v: string) => setData({...data, setup: { ...data.setup, tpManagement: v }})} placeholder="Target Objective" />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Execution Protocol" icon={ListChecks} color="text-indigo-400">
                            <div className="space-y-10">
                                <TagInput 
                                    label="Execution Checklist" 
                                    tags={data.execution.checklist} 
                                    onAdd={(t: string) => setData({ ...data, execution: { ...data.execution, checklist: [...data.execution.checklist, t] } })}
                                    onRemove={(i: number) => setData({ ...data, execution: { ...data.execution, checklist: data.execution.checklist.filter((_, idx) => idx !== i) } })}
                                />
                                <div className="grid grid-cols-3 gap-10">
                                    <EditableField label="Execution Style" value={data.execution.executionStyle} onChange={(v: string) => setData({...data, execution: { ...data.execution, executionStyle: v }})} />
                                    <EditableField label="SL Management" value={data.execution.slManagement} onChange={(v: string) => setData({...data, execution: { ...data.execution, slManagement: v }})} placeholder="When to move to BE?" />
                                    <EditableField label="Scale-out Management" value={data.execution.tpManagement} onChange={(v: string) => setData({...data, execution: { ...data.execution, tpManagement: v }})} placeholder="Partial TP steps" />
                                </div>
                            </div>
                        </Section>

                        <Section title="Risk Control" icon={Shield} color="text-rose-400">
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-16">
                                    <EditableField label="Risk Allocation" value={data.risk.riskStrategy} onChange={(v: string) => setData({...data, risk: { ...data.risk, riskStrategy: v }})} placeholder="e.g. 1% Risk, 3 trades max" multiline />
                                    <EditableField label="Loss Prevention" value={data.risk.generalRisk} onChange={(v: string) => setData({...data, risk: { ...data.risk, generalRisk: v }})} placeholder="Daily / Weekly limits" multiline />
                                </div>
                                <TagInput 
                                    label="High-Risk Variables to Avoid" 
                                    tags={data.risk.conditionsToAvoid} 
                                    onAdd={(t: string) => setData({ ...data, risk: { ...data.risk, conditionsToAvoid: [...data.risk.conditionsToAvoid, t] } })}
                                    onRemove={(i: number) => setData({ ...data, risk: { ...data.risk, conditionsToAvoid: data.risk.conditionsToAvoid.filter((_, idx) => idx !== i) } })}
                                />
                            </div>
                        </Section>

                        {/* Custom Sections (Custom Blueprints) */}
                        <AnimatePresence>
                            {data.customSections.map((sec, idx) => (
                                <Section 
                                    key={idx} 
                                    title={sec.title} 
                                    icon={FileText} 
                                    color="text-sky-400"
                                    onRemove={() => removeCustomSection(idx)}
                                >
                                    <EditableField 
                                        label="Content" 
                                        value={sec.content} 
                                        onChange={(v: string) => updateCustomSection(idx, v)} 
                                        placeholder={`Details for ${sec.title}...`} 
                                        multiline 
                                    />
                                </Section>
                            ))}
                        </AnimatePresence>

                        {/* Add Custom Blueprint Action */}
                        <div className="pt-12 pb-20 border-t border-white/10">
                            <button 
                                onClick={addCustomSection}
                                className="flex items-center gap-4 px-10 py-5 bg-white/[0.03] border border-dashed border-white/20 rounded-[2rem] text-white/70 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/[0.05] transition-all w-full group shadow-lg"
                            >
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-sky-500 group-hover:text-black transition-all">
                                    <Plus size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] group-hover:text-sky-400 transition-colors">Architect Custom Blueprint</p>
                                    <p className="text-xs text-white/40 group-hover:text-white/70 font-medium">Add personalized blocks, mental models, or custom data points to your playbook.</p>
                                </div>
                                <Sparkles size={24} className="ml-auto opacity-0 group-hover:opacity-100 text-sky-500 transition-all" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-500">
                         <InstitutionalCanvas 
                            elements={data.canvasElements || []} 
                            onElementsChange={(elements) => setData({ ...data, canvasElements: elements })} 
                         />
                    </div>
                )}
            </main>
        </div>
    );
}

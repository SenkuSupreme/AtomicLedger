"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Bot,
  Layers, 
  Book, 
  Target, 
  Activity, 
  CheckSquare,
  Sparkles,
  Zap,
  Terminal,
  Shield,
  Cpu,
  BrainCircuit,
  Repeat,
  ClipboardCheck,
  Notebook as NotebookIcon,
  FileText,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const TRADING_QUOTES = [
  "\"The goal of a successful trader is to make the best trades. Money is secondary.\"",
  "\"It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.\"",
  "\"Amateurs think about how much money they can make. Professionals think about how much money they could lose.\"",
  "\"Win or lose, everybody gets what they want out of the market.\"",
  "\"If you can't take a small loss, sooner or later you will take the mother of all losses.\"",
  "\"Trading is a waiting game. You wait for the best setup, you wait for the trade to trigger, you wait for the target to hit.\"",
  "\"The market is a device for transferring money from the impatient to the patient.\"",
  "\"Limit your size in any position so that fear does not become the prevailing instinct guiding your judgment.\"",
  "\"Never let a win go to your head, or a loss to your heart.\"",
  "\"Plan your trade and trade your plan.\""
];

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "I am fully synchronized with your trading ecosystem. I have access to your strategies, recent trades, and journal entries.\n\nMy neural core is active. Ask me about your performance or specific strategies.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState(TRADING_QUOTES[0]);
  
  const [stats, setStats] = useState({
    strategies: 0,
    journalEntries: 0,
    tasks: 0,
    goals: 0,
    habits: 0,
    notebook: 0,
    notesDetailed: 0,
    checklists: 0
  });

  useEffect(() => {
    // Randomize quote on mount
    setQuote(TRADING_QUOTES[Math.floor(Math.random() * TRADING_QUOTES.length)]);
  }, []);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);
  
  // Fetch real context stats
  useEffect(() => {
    fetch('/api/stats/overview')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setStats(data);
      })
      .catch(err => console.error("Stats fetch failed", err));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });

      if (!res.ok) throw new Error('AI transmission failed');

      const aiMsg = await res.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai', // Ensure strict typing
        content: aiMsg.content,
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error('Neural uplink failed. Check connection.');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: "⚠️ **System Failure**: Neural uplink interrupted. Please check your connection or API configuration.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const contextItems = [
    { label: "Strategies", count: stats.strategies, icon: Layers, color: "text-indigo-400" },
    { label: "Journal Entries", count: stats.journalEntries, icon: Book, color: "text-amber-400" },
    { label: "Tasks", count: stats.tasks, icon: CheckSquare, color: "text-blue-400" },
    { label: "Goals", count: stats.goals, icon: Target, color: "text-rose-400" },
    { label: "Habits", count: stats.habits, icon: Repeat, color: "text-yellow-400" },
    { label: "Notebook", count: stats.notebook, icon: NotebookIcon, color: "text-zinc-400" },
    { label: "Notes (Detailed)", count: stats.notesDetailed, icon: FileText, color: "text-cyan-400" },
    { label: "Checklists", count: stats.checklists, icon: ClipboardCheck, color: "text-emerald-400" },
  ];

  return (
    <div className="h-[calc(100vh-64px)]flex flex-col h-screen overflow-hidden bg-[#050505] text-white selection:bg-indigo-500/30">
        
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="flex h-full max-w-[1800px] mx-auto w-full relative z-10 p-6 gap-6">
        
        {/* Left Panel: Context Awareness */}
        <div className="hidden lg:flex flex-col w-80 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 gap-8 h-[calc(100vh-48px)]">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <BrainCircuit size={20} className="text-indigo-400" />
               </div>
               <div>
                 <h2 className="font-black text-sm uppercase tracking-widest">Neural Core</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Online & Synced</span>
                 </div>
               </div>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed mt-4 italic">
              {quote}
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 px-2">Active Data Streams</h3>
            {contextItems.map((item) => (
              <div key={item.label} className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-3">
                  <item.icon size={16} className={`${item.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-white/40">
                  {item.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.05] to-transparent animate-pulse" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2 text-indigo-400">
                 <Shield size={14} />
                 <span className="text-[10px] font-black uppercase tracking-wider">Privacy Protocol</span>
               </div>
               <p className="text-[10px] text-indigo-300/60 leading-relaxed">
                 Your data never leaves the secure encryption layer. Analysis is performed within your isolated tenant instance.
               </p>
             </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative h-[calc(100vh-48px)]">
            
            {/* Header */}
            <div className="shrink-0 h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span className="font-black text-sm uppercase tracking-[0.2em] text-white/80">
                     Apex Intelligence <span className="text-white/20 ml-2 italic">v2.4-TURBO</span>
                  </span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                     <Cpu size={12} className="text-indigo-400" />
                     <span className="text-[10px] font-mono text-white/40">LATENCY: 12ms</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                     <Database size={12} className="text-emerald-400" />
                     <span className="text-[10px] font-mono text-white/40">MEM: 512MB</span>
                  </div>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
               {messages.map((msg) => (
                 <motion.div 
                   key={msg.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex gap-6 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                 >
                    <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg ${
                      msg.role === 'ai' 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}>
                       {msg.role === 'ai' ? <Sparkles size={18} /> : <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />}
                    </div>

                    <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`flex items-center gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                            {msg.role === 'ai' ? 'SYSTEM' : 'YOU'}
                          </span>
                          <span className="text-[9px] font-mono text-white/20">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       
                       <div className={`
                         relative p-6 rounded-3xl text-sm leading-7 font-medium
                         ${msg.role === 'ai' 
                           ? 'bg-gradient-to-br from-indigo-500/[0.05] to-purple-500/[0.05] border border-white/10 text-white/80 rounded-tl-sm' 
                           : 'bg-white text-black border border-white rounded-tr-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]'}
                       `}>
                          {msg.role === 'ai' && (
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 rounded-3xl" />
                          )}
                          <div className="relative z-10 prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}

               {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex gap-6 max-w-4xl mx-auto"
                  >
                     <div className="shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Bot size={18} className="animate-pulse" />
                     </div>
                     <div className="flex items-center gap-2 p-4 rounded-3xl rounded-tl-sm bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                     </div>
                  </motion.div>
               )}
               <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-8 pt-0">
               <div className="max-w-4xl mx-auto relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-20 blur transition duration-1000 group-hover:opacity-40" />
                  <form onSubmit={handleSend} className="relative bg-[#0F0F0F] rounded-[2.5rem] flex items-center p-2 pl-8 border border-white/10 shadow-2xl">
                     <Terminal size={18} className="text-indigo-500 mr-4 shrink-0" />
                     <input 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Ask about your strategies, analysis, or performance..."
                       className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 font-medium h-12"
                     />
                     <button 
                       type="submit"
                       disabled={!input.trim() || isTyping}
                       className="w-12 h-12 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[1.8rem] flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-indigo-500 active:scale-95 shadow-lg"
                     >
                       <Send size={18} />
                     </button>
                  </form>
               </div>
               <div className="text-center mt-4">
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                    AI Model: Clause 3 (Custom Finetune) • Knowledge Cutoff: Realtime
                  </p>
               </div>
            </div>

        </div>

      </div>
    </div>
  );
}

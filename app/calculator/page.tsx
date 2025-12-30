"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  Target, 
  Shield, 
  Zap, 
  Activity, 
  Database, 
  Globe, 
  Cpu,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalculatorPage() {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [stopLoss, setStopLoss] = useState<number>(1.0820);
  const [lotSize, setLotSize] = useState<number>(0);
  const [pipsDistance, setPipsDistance] = useState<number>(0);
  const [riskAmount, setRiskAmount] = useState<number>(0);

  useEffect(() => {
    const riskVal = (balance * riskPercent) / 100;
    const distance = Math.abs(entryPrice - stopLoss);
    
    // Assuming standard 4-digit for forex (except JPY)
    // In a real app we would check the pair suffix
    const pips = distance * 10000; 
    
    // Position size in units = Risk Amount / (Distance * Point Value)
    // lot = units / 100,000
    const units = pips > 0 ? riskVal / (pips * 0.0001 * 10) : 0;
    const calculatedLots = units / 100000;

    setRiskAmount(riskVal);
    setPipsDistance(pips);
    setLotSize(calculatedLots);
  }, [balance, riskPercent, entryPrice, stopLoss]);

  return (
    <div className="space-y-12 text-white font-sans relative min-h-screen pb-20 overflow-hidden px-4 md:px-8">
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-amber-500/[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-sky-500/[0.03] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Header Mesh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 relative z-10 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400">Tactical Calculation 06 Live</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-white/20">
               <Cpu size={10} className="text-amber-500/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Precision: AI Enabled</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent leading-none">
            Neural Calculator
          </h1>
          <p className="text-white/30 text-sm font-medium italic max-w-xl leading-relaxed">
            "Advanced position sizing architecture. Prevent catastrophic capital erosion through algorithmic risk calibration and institutional precision."
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-1">Compute Latency</span>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl">
              <RefreshCw size={12} className="text-amber-500/50" />
              <span className="text-xl font-black text-white italic tracking-tighter tabular-nums">0.02MS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-7 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-12 shadow-3xl relative overflow-hidden group/inputs"
           >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.01] pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic pl-2">Account balance ($)</label>
                    <div className="relative group/input">
                       <input 
                         type="number" 
                         value={balance}
                         onChange={(e) => setBalance(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-2xl font-black italic tracking-tighter tabular-nums text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-all group-hover/input:border-white/10"
                       />
                       <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-hover/input:text-white/30 transition-colors">USD</div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic pl-2">Risk Exposure (%)</label>
                    <div className="relative group/input">
                       <input 
                         type="number" 
                         value={riskPercent}
                         onChange={(e) => setRiskPercent(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-2xl font-black italic tracking-tighter tabular-nums text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-all group-hover/input:border-white/10"
                       />
                       <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-hover/input:text-white/30 transition-colors">%</div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic pl-2">Entry price</label>
                    <div className="relative group/input">
                       <input 
                         type="number" 
                         value={entryPrice}
                         step="0.0001"
                         onChange={(e) => setEntryPrice(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-2xl font-black italic tracking-tighter tabular-nums text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-all group-hover/input:border-white/10"
                       />
                       <TrendingUp size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-hover/input:text-sky-500 transition-colors" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic pl-2">Stop Loss</label>
                    <div className="relative group/input">
                       <input 
                         type="number" 
                         value={stopLoss}
                         step="0.0001"
                         onChange={(e) => setStopLoss(Number(e.target.value))}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-2xl font-black italic tracking-tighter tabular-nums text-white focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-all group-hover/input:border-white/10"
                       />
                       <TrendingDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 group-hover/input:text-red-500 transition-colors" />
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative group/warning overflow-hidden">
                 <div className="absolute inset-0 bg-amber-500/5 translate-x-full group-hover/warning:translate-x-0 transition-transform duration-500" />
                 <div className="flex items-center gap-4 relative z-10">
                    <Shield size={24} className="text-amber-500/40" />
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] italic">Risk Level: Moderate Capital Exposure</p>
                 </div>
                 <div className="h-2 w-32 bg-white/5 rounded-full relative z-10 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[40%]" />
                 </div>
              </div>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                    <Target size={24} className="text-white/20 group-hover:text-amber-500" />
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Risk Distance</span>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter tabular-nums">{pipsDistance.toFixed(1)} Pips</h3>
                 </div>
              </div>
              <div className="bg-[#0A0A0A]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all">
                    <Shield size={24} className="text-white/20 group-hover:text-red-500" />
                 </div>
                 <div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Abs. Loss Vol.</span>
                    <h3 className="text-2xl font-black text-red-500/80 italic tracking-tighter tabular-nums">-${riskAmount.toFixed(2)}</h3>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Result Panel */}
        <div className="lg:col-span-5 h-full">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white text-black rounded-[4rem] p-16 h-full shadow-3xl flex flex-col justify-between relative overflow-hidden group/result"
           >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 blur-[80px] translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-16">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                       <Calculator size={24} className="text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] italic text-black/40">Execution Protocol</span>
                 </div>

                 <div className="space-y-4 mb-20">
                    <h3 className="text-[13px] font-black uppercase tracking-[0.5em] text-black/60 italic">Algorithmic Position</h3>
                    <div className="flex items-baseline gap-4">
                       <h2 className="text-[7rem] font-black italic tracking-tighter leading-none tabular-nums animate-pulse">
                         {lotSize.toFixed(2)}
                       </h2>
                       <span className="text-2xl font-black uppercase tracking-widest text-black/30">LOTS</span>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-black/5 pb-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 italic">Units to Trade</span>
                       <span className="text-lg font-black italic tabular-nums">{(lotSize * 100000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 italic">Pip Value (approx)</span>
                       <span className="text-lg font-black italic tabular-nums">${(lotSize * 10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 italic">Leverage Usage</span>
                       <span className="text-lg font-black italic tabular-nums">{(lotSize * 100000 / balance).toFixed(1)}:1</span>
                    </div>
                 </div>
              </div>

              <div className="relative z-10 pt-16">
                 <div className="bg-black text-white rounded-[2rem] p-8 group/cta hover:bg-amber-500 transition-all cursor-pointer shadow-2xl active:scale-95">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-40 group-hover:opacity-100 transition-opacity">Ready for order entry</span>
                       <Zap size={20} className="text-amber-500 group-hover:text-black" />
                    </div>
                    <h4 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-black transition-colors">Authorize Order Signal</h4>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Footer Disclaimer Mesh */}
      <div className="max-w-4xl mx-auto py-12 px-10 bg-white/[0.01] border border-white/5 rounded-[3rem] flex items-center gap-8 relative z-10">
         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
            <Info size={24} className="text-white/20" />
         </div>
         <p className="text-[10px] font-medium text-white/20 italic leading-relaxed uppercase tracking-widest">
           "Position sizing calculations are archival artifacts based on standard forex parameters. Verify point values for specific asset fragments before authorizing live capital orders. High leverage correlates with terminal risk cycles."
         </p>
      </div>
    </div>
  );
}

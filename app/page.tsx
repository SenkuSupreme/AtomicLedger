"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart2, 
  Brain, 
  History, 
  Shield, 
  LineChart, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Activity, 
  Lock,
  Globe,
  Cpu,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status, router]);

  if (status === "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white/20 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
        Synchronizing Neural Nodes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased relative overflow-hidden">
      
      {/* Institutional Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-blue-500/[0.04] blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[1200px] h-[1200px] bg-purple-500/[0.04] blur-[150px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-700 border-b ${scrolled ? "bg-black/60 backdrop-blur-2xl border-white/10" : "bg-transparent border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-500 shadow-2xl">
              <TrendingUp size={20} className="text-black group-hover:text-white transition-colors" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase group-hover:text-blue-400 transition-colors">ApexLedger</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
            <Link href="#features" className="hover:text-white transition-colors duration-300">Tactical Features</Link>
            <Link href="#methodology" className="hover:text-white transition-colors duration-300">Methodology</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="/auth/signin" 
              className="text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Log In
            </Link>
            <Link 
              href="/auth/signup" 
              className="group relative flex items-center gap-3 bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">Initialize Archival</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-64 pb-32 px-8 flex flex-col items-center justify-center min-h-[95vh] text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-3 px-4 py-1.5 mb-14 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic">Institutional Terminal v1.0 Live</span>
          </motion.div>

          <motion.h1 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="text-7xl md:text-[10rem] font-black mb-12 tracking-tighter leading-[0.8] italic uppercase bg-gradient-to-br from-white to-white/30 bg-clip-text text-transparent"
          >
            Tactical <span className="text-white/20">Archiving.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/40 mb-16 max-w-3xl mx-auto leading-relaxed font-black uppercase tracking-tight italic"
          >
            "Stop gambling. Start operating. The high-fidelity neural journal for traders who demand absolute precision and institutional edge."
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link 
              href="/auth/signup"
              className="min-w-[240px] h-16 flex items-center justify-center bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all shadow-3xl active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">Start Sync Cycle</span>
            </Link>
          </motion.div>
        </section>

        {/* Dashboard Preview */}
        <section className="px-8 pb-40 relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="relative rounded-[4rem] border border-white/5 bg-[#0A0A0A]/60 backdrop-blur-3xl p-4 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
               
               <div className="aspect-[16/9] bg-black rounded-[3rem] overflow-hidden relative border border-white/5 shadow-inner">
                  {/* Dashboard Mockup Content (Simplified for preview) */}
                  <div className="h-full w-full p-12 flex flex-col">
                     <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-6">
                           <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-white/5" />
                              <div className="w-3 h-3 rounded-full bg-white/5" />
                              <div className="w-3 h-3 rounded-full bg-white/5" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Archival Terminal 09</span>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] text-blue-400 font-black tracking-widest uppercase">Encryption Active</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-12 gap-10 flex-1">
                        <div className="col-span-8 space-y-10">
                           <div className="h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                              <div className="flex justify-between items-end mb-10">
                                 <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 block">Equity Calibration</span>
                                    <h3 className="text-5xl font-black text-white italic tracking-tighter tabular-nums">$124,592.00</h3>
                                 </div>
                                 <Activity className="text-blue-500/40" size={32} />
                              </div>
                              {/* Visual spacer for chart */}
                              <div className="h-32 w-full mt-12 bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-transparent rounded-full opacity-20 blur-3xl animate-pulse" />
                           </div>
                        </div>
                        <div className="col-span-4 space-y-8">
                           <div className="h-1/2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                              <div className="flex items-center justify-between mb-8">
                                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Neural Analysis</span>
                                 <Brain size={20} className="text-purple-500/40" />
                              </div>
                              <div className="space-y-4">
                                 <div className="h-1 bg-white/5 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[68%]" />
                                 </div>
                                 <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Efficiency: 68%</span>
                              </div>
                           </div>
                           <div className="h-1/2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                              <div className="flex items-center justify-between mb-8">
                                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sync Latency</span>
                                 <Globe size={20} className="text-emerald-500/40" />
                              </div>
                              <span className="text-3xl font-black text-emerald-500/40 font-mono tracking-widest">14MS</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Methodology Section */}
        <section id="methodology" className="py-40 px-8 bg-white text-black relative z-20">
          <div className="max-w-7xl mx-auto">
             <div className="flex items-baseline gap-6 mb-24">
               <h2 className="text-[8rem] md:text-[15rem] font-black tracking-tighter italic uppercase leading-[0.8]">The<br/>Method.</h2>
               <div className="h-[2px] w-64 bg-black/10" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {[
                  { id: "01", label: "ARCHIVE", title: "Forensic Records.", desc: "Architecture specifically designed for archival speed. Sync with brokers or initialize manual archival artifacts in milliseconds." },
                  { id: "02", label: "DECODE", title: "Neural Decoding.", desc: "Our algorithms detect patterns in the psychic noise. Emotional tilt, revenge cycles, and strategic drift identified per operational sync." },
                  { id: "03", label: "CALIBRATE", title: "Absolute Edge.", desc: "Use high-fidelity analytics to recalibrate your tactical playbook. Trade with the machine-like consistency of an institution." },
                ].map((item, i) => (
                  <div key={i} className="space-y-10 group">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black bg-black text-white px-4 py-1.5 rounded-full tracking-[0.4em] italic">{item.id} — {item.label}</span>
                    </div>
                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">{item.title}</h3>
                    <p className="text-xl text-black/40 font-black uppercase tracking-tight italic leading-relaxed">
                      "{item.desc}"
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-40 px-8">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-[0.8]">Institutional<br/><span className="text-white/20">Essentials.</span></h2>
                <div className="max-w-md space-y-6">
                   <p className="text-white/40 text-[13px] font-black uppercase tracking-[0.3em] italic">"The terminal strips away the noise. Only tools mathematically correlating to P&L remain active."</p>
                   <div className="h-px w-full bg-white/5" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: <BarChart2 size={48} />, title: "Precision Analytics", desc: "No vanity metrics. Drawdown forensic, MAE/MFE calibration, and pure expectancy artifacts.", color: "blue", dark: true },
                  { icon: <Brain size={48} />, title: "Psychological AI", desc: "Your personal terminal risk manager. Detects emotional deviation before it impacts the ledger.", color: "purple", dark: false },
                  { icon: <Shield size={48} />, title: "Capital Guards", desc: "Hard lockout protocols. Daily drawdown caps. Protect institutional capital at all algorithmic costs.", color: "red", dark: true },
                  { icon: <History size={48} />, title: "Forensic Backtest", desc: "Replay archival fragments to validate the edge. Zero risk capital exposure for unproven tactical systems.", color: "emerald", dark: false },
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className={`p-16 rounded-[4rem] min-h-[500px] flex flex-col justify-between group transition-all duration-700 relative overflow-hidden ${
                      feature.dark 
                        ? "bg-[#0A0A0A] border border-white/5 text-white" 
                        : "bg-white text-black"
                    }`}
                  >
                     <div className={`absolute inset-0 bg-${feature.color}-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
                     <div className={`${feature.dark ? "text-white/20 group-hover:text-white" : "text-black/20 group-hover:text-black"} transition-colors duration-500`}>
                        {feature.icon}
                     </div>
                     <div className="space-y-6">
                        <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{feature.title}</h3>
                        <p className={`${feature.dark ? "text-white/40 group-hover:text-white/70" : "text-black/40 group-hover:text-black/70"} text-xl font-black uppercase tracking-tight italic transition-colors`}>
                           "{feature.desc}"
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-64 px-8 border-t border-white/5 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/[0.05] blur-[150px] -z-10" />
           <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter italic uppercase leading-[0.8] mb-20 animate-pulse">
                No Color.<br/><span className="text-white/20">Just Alpha.</span>
              </h2>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center gap-6 bg-white text-black px-16 py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all shadow-3xl active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Initialize Archival</span>
                <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-black text-white/20 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <TrendingUp size={14} className="text-white/40" />
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white/40">ApexLedger</span>
           </div>
           <div className="flex gap-16">
              <Link href="/terms" className="hover:text-white transition-colors italic">Protocol: Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors italic">Encryption: Privacy</Link>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="italic">EST. 2024 Archival</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

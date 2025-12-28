
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, BarChart2, Brain, History, Shield, LineChart, Zap, 
  CheckCircle2, TrendingUp, Layers, Activity, Lock 
} from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [status, router]);

  if (status === 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
      
      {/* Background Subtle Grid */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/10' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <TrendingUp size={16} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">ApexLedger</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors duration-300">Features</Link>
            <Link href="#methodology" className="hover:text-white transition-colors duration-300">Methodology</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin" 
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Log In
            </Link>
            <Link 
              href="/auth/signup" 
              className="group flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold transition-all"
            >
              Get Started
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 z-10 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center">
           <div className="inline-flex items-center justify-center gap-2 px-3 py-1 mb-12 border border-white/10 rounded-full bg-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System v1.0 Operational</span>
           </div>

          <h1 className="text-6xl md:text-9xl font-medium mb-10 tracking-tighter leading-[0.9]">
            Trading <span className="text-gray-500">Solved</span>.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Stop gambling. Start operating. The minimalist journal for traders who demand precision, clarity, and edge.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/auth/signup"
              className="min-w-[200px] h-14 flex items-center justify-center bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors"
            >
              Start Journaling
            </Link>

          </div>
        </div>
      </section>


      {/* Dashboard Preview - Brutalist/High-Fidelity */}
      <section className="px-6 pb-32 z-20 relative">
         <div className="max-w-6xl mx-auto perspective-1000">
            <div className="relative rounded-2xl border border-white/10 bg-[#050505] p-3 shadow-2xl transform rotate-x-6 hover:rotate-x-0 transition-transform duration-1000 ease-out group">
               {/* Glow effect back */}
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-white/10 to-purple-500/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
               
               <div className="aspect-[16/9] bg-[#0A0A0A] rounded-xl overflow-hidden relative border border-white/5">
                  {/* Dashboard Header */}
                  <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-[#050505]">
                     <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-white/10" />
                           <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-white/10" />
                           <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-white/10" />
                        </div>
                        <div className="h-6 w-px bg-white/5 mx-2" />
                        <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                           <span className="text-white">Dashboard</span>
                           <span className="hover:text-white transition-colors cursor-pointer">Journal</span>
                           <span className="hover:text-white transition-colors cursor-pointer">Backtest</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="px-2 py-1 bg-green-900/20 border border-green-500/20 rounded text-[10px] text-green-500 font-mono">LIVE</div>
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                     </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-8 grid grid-cols-12 gap-6 h-full font-mono text-xs">
                     {/* Sidebar - minimized */}
                     <div className="col-span-1 hidden md:flex flex-col gap-4 items-center pt-2 border-r border-white/5 h-full">
                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded bg-white/5" />)}
                     </div>

                     <div className="col-span-12 md:col-span-11 grid grid-cols-12 gap-6">
                        {/* Main Chart Area */}
                        <div className="col-span-8 space-y-6">
                           <div className="h-80 border border-white/5 rounded-lg p-6 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                              <div className="flex justify-between items-center mb-6">
                                 <div>
                                    <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Account Equity</div>
                                    <div className="text-3xl font-bold text-white tracking-tight">$124,592.00</div>
                                 </div>
                                 <div className="flex gap-2">
                                     <div className="px-2 py-1 bg-white/5 rounded text-gray-400">1H</div>
                                     <div className="px-2 py-1 bg-white/10 rounded text-white">4H</div>
                                     <div className="px-2 py-1 bg-white/5 rounded text-gray-400">1D</div>
                                 </div>
                              </div>
                              
                              {/* Complex Chart Graphic */}
                              <svg className="w-full h-48" viewBox="0 0 100 40" preserveAspectRatio="none">
                                  {/* Grid Lines */}
                                  {[0, 10, 20, 30, 40].map(y => (
                                     <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.1" />
                                  ))}
                                  {/* Data Line */}
                                  <path d="M0 35 C 10 35, 15 38, 20 32 C 25 25, 30 28, 35 20 C 40 12, 45 15, 50 18 C 55 21, 60 15, 65 10 C 70 5, 75 8, 80 5 C 85 2, 90 4, 95 1 C 98 0, 100 0, 100 0" 
                                        fill="none" stroke="white" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
                                  {/* Area Gradient */}
                                  <path d="M0 35 C 10 35, 15 38, 20 32 C 25 25, 30 28, 35 20 C 40 12, 45 15, 50 18 C 55 21, 60 15, 65 10 C 70 5, 75 8, 80 5 C 85 2, 90 4, 95 1 C 98 0, 100 0, 100 0 V 40 H 0 Z" 
                                        fill="white" fillOpacity="0.03" />
                                  {/* Floating Point */}
                                  <circle cx="100" cy="0" r="1.5" fill="white" className="animate-pulse" />
                              </svg>
                           </div>

                           <div className="grid grid-cols-3 gap-6">
                              {[
                                 { label: 'Win Rate', val: '68%', color: 'text-white' },
                                 { label: 'Profit Factor', val: '2.41', color: 'text-white' },
                                 { label: 'Avg R:R', val: '1:3.2', color: 'text-gray-400' }
                              ].map((stat, i) => (
                                 <div key={i} className="h-24 border border-white/5 rounded-lg p-4 bg-white/[0.01]">
                                    <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">{stat.label}</div>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Recent Trades / AI Side */}
                        <div className="col-span-4 space-y-4">
                           <div className="h-full border border-white/5 rounded-lg p-5 bg-[#080808]">
                              <div className="flex justify-between items-center mb-6">
                                 <div className="text-gray-500 text-[10px] uppercase tracking-widest">AI Analysis</div>
                                 <Brain size={12} className="text-white" />
                              </div>
                              
                              <div className="space-y-4">
                                 <div className="p-3 border border-white/10 rounded bg-white/5">
                                    <div className="flex gap-2 mb-2 items-center">
                                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                       <span className="text-white font-bold">Tilt Risk</span>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed">
                                       Increasing position size after losses detected. Recommendation: Size down 50%.
                                    </p>
                                 </div>

                                 <div className="p-3 border border-white/5 rounded">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-gray-300 font-bold">BTCUSD</span>
                                       <span className="text-green-500">+2.4R</span>
                                    </div>
                                    <div className="text-gray-500 text-[10px]">Strategy: Breakout</div>
                                 </div>
                                 <div className="p-3 border border-white/5 rounded">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-gray-300 font-bold">EURUSD</span>
                                       <span className="text-red-500">-1.0R</span>
                                    </div>
                                    <div className="text-gray-500 text-[10px]">Strategy: Reversal</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
               
            {/* Ambient Reflection on floor */}
            <div className="absolute -bottom-20 left-10 right-10 h-20 bg-white/5 blur-[50px] rounded-[50%]" />
         </div>
      </section>


      {/* Methodology Section */}
      <section id="methodology" className="py-32 px-6 bg-white text-black">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-medium tracking-tighter mb-24">The Method.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
               <div className="space-y-6">
                  <div className="text-xs font-mono border border-black/20 rounded-full px-3 py-1 inline-block">01 — LOG</div>
                  <h3 className="text-4xl font-bold">Frictionless Entry.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                     A journal specifically designed for speed. Sync with brokers or manual entry in seconds.
                  </p>
               </div>
               
               <div className="space-y-6">
                  <div className="text-xs font-mono border border-black/20 rounded-full px-3 py-1 inline-block">02 — ANALYZE</div>
                  <h3 className="text-4xl font-bold">Pattern Recognition.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                     Our algorithms detect what you can't see. Emotional tilt, revenge trading, and winning setups identified automatically.
                  </p>
               </div>
               
               <div className="space-y-6">
                  <div className="text-xs font-mono border border-black/20 rounded-full px-3 py-1 inline-block">03 — EXECUTE</div>
                  <h3 className="text-4xl font-bold">Flawless Execution.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                     Use data to refine your rules. Lock in your edge. Trade with machine-like consistency.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Bento Grid Features - Light/Dark Contrast */}
      <section id="features" className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
               <h2 className="text-5xl md:text-7xl font-medium tracking-tighter">Everything<br/>Essentials.</h2>
               <p className="text-gray-400 max-w-sm text-lg">We stripped away the noise. Only tools that directly correlate with higher P&L remain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-[#111] p-12 rounded-3xl min-h-[400px] flex flex-col justify-between group hover:bg-[#151515] transition-colors border border-white/5 text-white">
                  <BarChart2 className="w-12 h-12 mb-8" />
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Deep Analytics</h3>
                    <p className="text-gray-400">Not just vanity metrics. Drawdown duration, MAE/MFE, and expectancy per setup.</p>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-3xl min-h-[400px] flex flex-col justify-between text-black group">
                  <Brain className="w-12 h-12 mb-8" />
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Psychological AI</h3>
                    <p className="text-gray-600">Your personal risk manager. It reads your notes and flags emotional deviation before it drains your account.</p>
                  </div>
               </div>
               
               <div className="bg-white p-12 rounded-3xl min-h-[400px] flex flex-col justify-between text-black group">
                  <History className="w-12 h-12 mb-8 h-12 mb-8" />
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Backtest Engine</h3>
                    <p className="text-gray-600">Replay history to validate your edge. Don't risk real capital on unproven theories.</p>
                  </div>
               </div>

                <div className="bg-[#111] p-12 rounded-3xl min-h-[400px] flex flex-col justify-between group hover:bg-[#151515] transition-colors border border-white/5 text-white">
                  <Shield className="w-12 h-12 mb-8" />
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Risk Guards</h3>
                    <p className="text-gray-400">Set hard limits. Stop loss enforcement. Daily loss lockouts. Protect your capital at all costs.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-white/10">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter mb-12">No Color.<br/>Just <span className="text-gray-500">Alpha</span>.</h2>
            <Link 
                  href="/auth/signup"
                  className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-bold text-xl hover:bg-gray-200 transition-colors"
               >
                  Get Started
                  <ArrowRight size={20} />
               </Link>
         </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="font-bold text-white tracking-tight text-lg">ApexLedger</div>
           <div className="flex gap-8">
              <Link href="/terms" className="cursor-pointer hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="cursor-pointer hover:text-white transition-colors">Privacy</Link>
           </div>
           <p className="font-mono text-xs">EST. 2024</p>
        </div>
      </footer>
    </div>
  );
}


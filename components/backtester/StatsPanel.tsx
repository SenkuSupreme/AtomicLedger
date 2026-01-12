import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { NewsEvent, Position, AccountStats, Candle } from "./types";
import { calculatePnL } from "./utils";

interface StatsPanelProps {
    positions: Position[];
    account: AccountStats;
    currentCandle: Candle | null;
    onClosePosition: (id: number) => void;
    onPartialClose: (id: number) => void;
    onBE?: (id: number) => void;
    updatePosition?: (id: number, updates: Partial<Position>) => void;
    newsEvents: NewsEvent[];
}

export default function StatsPanel({ positions, account, currentCandle, onClosePosition, onPartialClose, onBE, updatePosition, newsEvents }: StatsPanelProps) {
    const [activeTab, setActiveTab] = useState<'positions' | 'pending' | 'journal' | 'news' | 'performance'>('positions');

    return (
        <div className="h-full border-t border-white/5 bg-[#0A0A0A] flex flex-col">
            <div className="flex items-center gap-1 px-2 border-b border-white/5">
                {['positions', 'pending', 'journal', 'news', 'performance'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-600 hover:text-gray-300'}`}
                    >
                        {tab} {tab === 'positions' && positions.filter(p => p.isOpen && !p.isPending).length > 0 && `(${positions.filter(p => p.isOpen && !p.isPending).length})`}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-auto scrollbar-hide">
                {activeTab === 'news' ? (
                    <table className="w-full text-left text-[11px] font-mono whitespace-nowrap">
                         <thead className="text-gray-600 bg-[#0F0F0F] sticky top-0">
                            <tr>
                                <th className="py-2 px-4">Time</th>
                                <th className="py-2 px-4">Impact</th>
                                <th className="py-2 px-4">Event</th>
                                <th className="py-2 px-4">Forecast</th>
                                <th className="py-2 px-4">Actual</th>
                            </tr>
                         </thead>
                          <tbody className="divide-y divide-white/5">
                             {newsEvents.map(e => (
                                 <tr key={e.id} className="hover:bg-white/5">
                                     <td className="py-2 px-4 text-gray-400">{new Date(e.time * 1000).toLocaleString()}</td>
                                     <td className="py-2 px-4">
                                         <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${e.impact === 'high' ? 'bg-red-500/20 text-red-500' : e.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                             {e.impact}
                                         </span>
                                     </td>
                                     <td className="py-2 px-4 font-bold text-gray-100">{e.title}</td>
                                     <td className="py-2 px-4 text-gray-400">{e.forecast}</td>
                                     <td className="py-2 px-4 text-gray-400">{e.actual}</td>
                                 </tr>
                             ))}
                         </tbody>
                    </table>
                ) : activeTab === 'journal' ? (
                     <div className="flex flex-col h-full bg-[#0F0F0F]">
                        {/* Journal Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0A] border-b border-white/5 text-[10px] font-bold uppercase text-gray-500">
                            <div className="w-16">ID</div>
                            <div className="w-24">Date</div>
                            <div className="w-12">Type</div>
                            <div className="w-16 text-right">PnL</div>
                            <div className="w-24 pl-4">Playbook</div>
                            <div className="flex-1 pl-4">Notes</div>
                            <div className="w-32 pl-4">Tags</div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {positions.filter(p => !p.isOpen && !p.isPending).sort((a,b) => (b.exitTime||0) - (a.exitTime||0)).map(p => (
                                <div key={p.id} className="flex items-center px-4 py-2 border-b border-white/5 hover:bg-white/5 text-xs">
                                     <div className="w-16 text-gray-500 font-mono">#{p.id.toString().slice(-4)}</div>
                                     <div className="w-24 text-gray-400 text-[10px]">{p.exitTime ? new Date(p.exitTime*1000).toLocaleString() : '-'}</div>
                                     <div className={`w-12 font-bold ${p.type.includes('buy')?'text-emerald-500':'text-red-500'}`}>{p.type.includes('buy')?'BUY':'SELL'}</div>
                                     <div className={`w-16 text-right font-mono font-bold ${(p.pnl||0)>=0?'text-emerald-400':'text-red-400'}`}>${(p.pnl||0).toFixed(2)}</div>
                                     
                                     {/* Playbook Select */}
                                     <div className="w-24 pl-4">
                                         <select 
                                            value={p.playbook || ''} 
                                            onChange={(e) => updatePosition?.(p.id, { playbook: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded text-[10px] text-gray-300 focus:border-blue-500 outline-none p-1"
                                         >
                                             <option value="">- Setup -</option>
                                             <option value="Breakout">Breakout</option>
                                             <option value="Reversal">Reversal</option>
                                             <option value="Pullback">Pullback</option>
                                             <option value="News">News Fade</option>
                                             <option value="Scalp">Scalp</option>
                                         </select>
                                     </div>

                                     {/* Notes Input */}
                                     <div className="flex-1 pl-4">
                                         <input 
                                            type="text" 
                                            placeholder="Notes..." 
                                            value={p.notes || ''}
                                            onChange={(e) => updatePosition?.(p.id, { notes: e.target.value })}
                                            className="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 text-gray-300 outline-none text-[11px] placeholder-gray-700"
                                         />
                                     </div>

                                     {/* Tags Input */}
                                     <div className="w-32 pl-4">
                                         <input 
                                            type="text" 
                                            placeholder="Tags..." 
                                            value={p.tags?.join(', ') || ''}
                                            onChange={(e) => updatePosition?.(p.id, { tags: e.target.value.split(',').map(s=>s.trim()) })}
                                            className="w-full bg-transparent border border-white/5 rounded px-2 py-0.5 text-[10px] text-gray-400 focus:border-blue-500 outline-none"
                                         />
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                ) : activeTab === 'performance' ? (
                    <div className="p-6 grid grid-cols-4 gap-4 text-xs">
                        {/* 1. Total P&L - Primary Metric */}
                        <div className="col-span-1 p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-4xl text-white font-black">$</span>
                             </div>
                             <div className="text-gray-400 mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">Total P&L</div>
                             <div className={`text-3xl font-black tracking-tight ${(account.balance - 100000) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                 ${(account.balance - 100000).toFixed(2)}
                             </div>
                             <div className="mt-2 text-[10px] text-gray-500 font-mono">
                                 {(() => {
                                     const closed = positions.filter(p => !p.isOpen && !p.isPending);
                                     if(closed.length === 0) return "No Data";
                                     const avg = (account.balance - 100000) / closed.length;
                                     return `${avg >= 0 ? '+' : ''}${avg.toFixed(2)} avg per trade`;
                                 })()}
                             </div>
                        </div>

                        {/* 2. Win Rate - with Visual Bar */}
                        <div className="col-span-1 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 relative">
                             <div className="text-gray-400 mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">Win Rate</div>
                             {(() => {
                                 const closed = positions.filter(p => !p.isOpen && !p.isPending);
                                 const wins = closed.filter(p => (p.pnl || 0) > 0).length;
                                 const rate = closed.length > 0 ? (wins / closed.length) * 100 : 0;
                                 return (
                                     <>
                                        <div className="text-3xl font-black text-blue-400 mb-1">{rate.toFixed(1)}%</div>
                                        <div className="text-[10px] text-gray-500 font-mono mb-3">{wins}W - {closed.length - wins}L</div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rate}%` }} />
                                        </div>
                                     </>
                                 );
                             })()}
                        </div>

                        {/* 3. Profit Factor */}
                        <div className="col-span-1 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
                             <div className="text-gray-400 mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">Profit Factor</div>
                             {(() => {
                                 const closed = positions.filter(p => !p.isOpen && !p.isPending);
                                 const grossProfit = closed.reduce((acc, p) => acc + ((p.pnl||0) > 0 ? (p.pnl||0) : 0), 0);
                                 const grossLoss = Math.abs(closed.reduce((acc, p) => acc + ((p.pnl||0) < 0 ? (p.pnl||0) : 0), 0));
                                 const pf = grossLoss === 0 ? (grossProfit > 0 ? 999 : 0) : grossProfit / grossLoss;
                                 
                                 return (
                                     <>
                                        <div className="text-3xl font-black text-emerald-400 mb-1">{pf === 999 ? "∞" : pf.toFixed(2)}</div>
                                        <div className={`text-[9px] uppercase tracking-widest font-bold ${pf > 1.5 ? 'text-emerald-500/60' : 'text-gray-600'}`}>
                                            {pf > 2 ? 'High Performance' : pf > 1 ? 'Profitable' : 'Drawdown'}
                                        </div>
                                     </>
                                 );
                             })()}
                        </div>

                        {/* 4. Expectancy */}
                        <div className="col-span-1 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5">
                             <div className="text-gray-400 mb-2 uppercase tracking-[0.2em] text-[9px] font-bold">Expectancy</div>
                             {(() => {
                                 const closed = positions.filter(p => !p.isOpen && !p.isPending);
                                 if (closed.length === 0) return <div className="text-3xl font-black text-gray-700">$0.00</div>;
                                 
                                 const totalPnL = account.balance - 100000;
                                 const expectancy = totalPnL / closed.length;
                                 
                                 return (
                                     <>
                                        <div className={`text-3xl font-black ${expectancy >= 0 ? 'text-emerald-400' : 'text-red-400'} mb-1`}>
                                            {expectancy >= 0 ? '+' : ''}${expectancy.toFixed(2)}
                                        </div>
                                        <div className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Per Trade Edge</div>
                                     </>
                                 );
                             })()}
                        </div>

                         {/* Breakdown Row */}
                        <div className="col-span-2 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col justify-center">
                             <div className="flex justify-between items-end mb-2">
                                 <div>
                                    <div className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-bold mb-1">Max Drawdown</div>
                                    <div className="text-2xl font-bold text-red-400">
                                         $0.00 <span className="text-[10px] text-gray-500 font-normal ml-2">(Mock)</span>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase border border-emerald-500/20">Minimal Risk</div>
                                 </div>
                             </div>
                        </div>

                        <div className="col-span-2 p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col justify-center">
                             <div className="flex items-center gap-8">
                                 <div>
                                    <div className="text-gray-400 uppercase tracking-[0.2em] text-[9px] font-bold mb-1">Total Trades</div>
                                    <div className="text-3xl font-black text-white">{positions.filter(p => !p.isOpen && !p.isPending).length}</div>
                                 </div>
                                 <div className="h-8 w-[1px] bg-white/10" />
                                 <div>
                                     <div className="text-[10px] text-emerald-400 font-mono mb-1">{positions.filter(p => !p.isOpen && !p.isPending && (p.pnl||0)>0).length} winners</div>
                                     <div className="text-[10px] text-red-400 font-mono">{positions.filter(p => !p.isOpen && !p.isPending && (p.pnl||0)<0).length} losers</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                ) : (
                <table className="w-full text-left text-[11px] font-mono whitespace-nowrap">
                    <thead className="text-gray-600 bg-[#0F0F0F] sticky top-0">
                        <tr>
                            <th className="py-2 px-4 font-normal">ID</th>
                            <th className="py-2 px-4 font-normal">Time</th>
                            <th className="py-2 px-4 font-normal">Type</th>
                            <th className="py-2 px-4 font-normal">Size</th>
                            <th className="py-2 px-4 font-normal">Entry</th>
                            <th className="py-2 px-4 font-normal">S/L</th>
                            <th className="py-2 px-4 font-normal">T/P</th>
                             <th className="py-2 px-4 font-normal">Current</th>
                            <th className="py-2 px-4 font-normal text-right">Profit</th>
                            <th className="py-2 px-4 font-normal text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {positions
                           .filter(p => {
                               if (activeTab === 'positions') return p.isOpen && !p.isPending;
                               if (activeTab === 'pending') return p.isPending;
                               return !p.isOpen && !p.isPending; // history
                           })
                           .map(p => {
                               const price = currentCandle?.close || 0;
                               // If closed, use stored PnL. If open, calc floating.
                               const currentPnl = p.isOpen 
                                  ? calculatePnL(p.type, p.entryPrice, price, p.lotSize) - p.commission 
                                  : p.pnl;
                               
                               return (
                                <tr key={p.id} className="hover:bg-white/5 group">
                                    <td className="py-2 px-4 text-gray-500">#{p.id.toString().slice(-4)}</td>
                                    <td className="py-2 px-4 text-gray-400">{new Date(p.entryTime * 1000).toLocaleString()}</td>
                                    <td className={`py-2 px-4 font-bold ${p.type.includes('buy') ? 'text-emerald-500' : 'text-red-500'}`}>{p.type.toUpperCase()}</td>
                                    <td className="py-2 px-4 font-bold">{p.lotSize}</td>
                                    <td className="py-2 px-4">{p.entryPrice.toFixed(5)}</td>
                                    <td className="py-2 px-4 text-red-400">{p.slPrice?.toFixed(5) || '-'}</td>
                                    <td className="py-2 px-4 text-emerald-400">{p.tpPrice?.toFixed(5) || '-'}</td>
                                    <td className="py-2 px-4">{p.isOpen ? price.toFixed(5) : p.exitPrice?.toFixed(5)}</td>
                                    <td className={`py-2 px-4 text-right font-bold ${(currentPnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {(currentPnl || 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-4 text-center flex items-center justify-center gap-2">
                                        {p.isOpen && (
                                            <>
                                                <button onClick={() => onBE?.(p.id)} className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 rounded text-[9px] uppercase text-blue-400 border border-blue-500/20">BE</button>
                                                <button onClick={() => onPartialClose(p.id)} className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-[9px] uppercase text-gray-400">50%</button>
                                                <button onClick={() => onClosePosition(p.id)} className="p-1 hover:text-red-500 text-gray-500"><X size={14}/></button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                               )
                        })}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
}

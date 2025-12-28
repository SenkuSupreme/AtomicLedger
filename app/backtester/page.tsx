
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, PlayCircle } from 'lucide-react';

export default function BacktesterPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only backtest trades
    fetch('/api/trades?type=backtest')
      .then((res) => res.json())
      .then((data) => {
        setTrades(data.trades || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-500 font-mono text-sm">LOADING SIMULATION DATA...</div>;

  const totalPnL = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const winRate = trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Backtester Engine</h1>
          <p className="text-gray-400">Simulate history. Validate your edge.</p>
        </div>
        <Link
          href="/backtester/new"
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold transition-colors"
        >
          <Plus size={20} />
          New Simulation Trade
        </Link>
      </header>

      {/* Mini Stats for Backtest Session */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl">
             <p className="text-xs font-mono uppercase text-gray-500 mb-1">Simulated P&L</p>
             <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>${totalPnL.toFixed(2)}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl">
             <p className="text-xs font-mono uppercase text-gray-500 mb-1">Win Rate</p>
             <p className="text-2xl font-bold text-white">{winRate}%</p>
          </div>
           <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl">
             <p className="text-xs font-mono uppercase text-gray-500 mb-1">Trades Logged</p>
             <p className="text-2xl font-bold text-white">{trades.length}</p>
          </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <PlayCircle size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-gray-300">Simulation Log</span>
        </div>
        
        {trades.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
                <p>No simulation data found.</p>
                <p className="text-sm">Start a manual backtest session.</p>
            </div>
        ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 uppercase font-medium text-xs tracking-wider">
                    <tr>
                    <th className="px-6 py-4 text-gray-500">Date Logged</th>
                    <th className="px-6 py-4 text-gray-500">Symbol</th>
                    <th className="px-6 py-4 text-gray-500">Side</th>
                    <th className="px-6 py-4 text-right text-gray-500">Result</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {trades.map((trade) => (
                        <tr key={trade._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{new Date(trade.createdAt).toLocaleDateString()}</td>
                             <td className="px-6 py-4 font-bold text-white">{trade.symbol}</td>
                             <td className="px-6 py-4 uppercase text-xs">{trade.direction}</td>
                             <td className={`px-6 py-4 text-right font-bold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${(trade.pnl || 0).toFixed(2)}
                             </td>
                        </tr>
                    ))}
                </tbody>
                </table>
             </div>
        )}
      </div>
    </div>
  );
}


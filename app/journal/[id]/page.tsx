
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TradeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/trades/${id}`) // Need to implement this route or change fetches
      .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
      })
      .then((data) => {
        setTrade(data);
        setLoading(false);
      })
      .catch((err) => {
         console.error(err);
         // Fallback to client side filtering if ID based fetch not implemented
         // But better to implement the route
         setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading trade details...</div>;
  if (!trade) return <div>Trade not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold text-white">{trade.symbol} Trade</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           {/* Main Info Card */}
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700/50">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                 <div>
                    <label className="text-sm text-gray-400">Direction</label>
                    <p className={`font-bold ${trade.direction === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.direction.toUpperCase()}
                    </p>
                 </div>
                 <div>
                    <label className="text-sm text-gray-400">P&L</label>
                    <p className={`font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${trade.pnl.toFixed(2)}
                    </p>
                 </div>
                 <div>
                    <label className="text-sm text-gray-400">Asset</label>
                    <p className="font-medium capitalize">{trade.assetType}</p>
                 </div>
                 <div>
                    <label className="text-sm text-gray-400">Date</label>
                    <p className="font-medium">{new Date(trade.timestampEntry).toLocaleDateString()}</p>
                 </div>
             </div>
             
             <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-mono uppercase">Notes</span>
                <button 
                    onClick={async () => {
                        const btn = document.getElementById('analyze-btn');
                        if(btn) btn.innerText = 'Analyzing...';
                        try {
                            const res = await fetch('/api/ai/analyze-sentiment', {
                                method: 'POST',
                                body: JSON.stringify({ note: trade.notes })
                            });
                            const data = await res.json();
                            const resultDiv = document.getElementById('ai-result');
                            if(resultDiv && data.sentiment) {
                                resultDiv.innerHTML = `
                                    <div class="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="text-xs font-mono uppercase text-gray-400">Psychology Analysis</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="text-lg capitalize font-bold ${data.sentiment === 'positive' ? 'text-green-400' : 'text-red-400'}">${data.sentiment}</span>
                                            <div class="flex gap-2">
                                                ${data.keywords.map((k:string) => `<span class="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">#${k}</span>`).join('')}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }
                        } catch(e) {
                            alert('AI Analysis Failed');
                        }
                        if(btn) btn.innerText = '🧠 Analyze Psychology';
                    }}
                    id="analyze-btn"
                    className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded hover:bg-purple-500/20 transition-colors"
                >
                    🧠 Analyze Psychology
                </button>
            </div>
            <p className="text-lg text-gray-300 whitespace-pre-wrap font-serif bg-[#111] p-4 rounded-lg border border-white/5">{trade.notes || '-'}</p>
            <div id="ai-result"></div>
          </div>
           </div>
        </div>

        <div className="space-y-6">
           {/* Side Info */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold mb-4">Trade Stats</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Entry</span>
                        <span>{trade.entryPrice}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Exit</span>
                        <span>{trade.exitPrice || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Quantity</span>
                        <span>{trade.quantity}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {trade.tags && trade.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                            #{tag}
                        </span>
                    ))}
                    {(!trade.tags || trade.tags.length === 0) && <span className="text-gray-500 text-sm">No tags</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

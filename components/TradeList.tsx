'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Trade {
  _id: string;
  symbol: string;
  assetType: string;
  entryPrice: number;
  exitPrice: number;
  direction: 'long' | 'short';
  pnl: number;
  rMultiple?: number;
  timestampEntry: string;
}

export default function TradeList({ 
    initialPortfolioId = '', 
    initialDateRange = { start: '', end: '' } 
}: { 
    initialPortfolioId?: string, 
    initialDateRange?: { start: string, end: string } 
}) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>({ page: 1, pages: 1 });
  const [filter, setFilter] = useState({ 
      symbol: '', 
      status: '', 
      portfolioId: initialPortfolioId,
      startDate: initialDateRange.start,
      endDate: initialDateRange.end
  });
  const [sort, setSort] = useState({ field: 'timestampEntry', order: 'desc' });

  // Update internal filter when props change
  useEffect(() => {
    setFilter(prev => {
        // Only update if values actually changed to prevent loops
        if (prev.portfolioId === initialPortfolioId && 
            prev.startDate === initialDateRange.start && 
            prev.endDate === initialDateRange.end) {
            return prev;
        }
        return { 
            ...prev, 
            portfolioId: initialPortfolioId,
            startDate: initialDateRange.start,
            endDate: initialDateRange.end
        };
    });
  }, [initialPortfolioId, initialDateRange.start, initialDateRange.end]);

  const fetchTrades = React.useCallback(() => {
      setLoading(true);
      const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: '10',
          sort: sort.field,
          order: sort.order,
          symbol: filter.symbol,
          status: filter.status,
          ...(filter.portfolioId && { portfolioId: filter.portfolioId }),
          ...(filter.startDate && { startDate: filter.startDate }),
          ...(filter.endDate && { endDate: filter.endDate })
      });

      fetch(`/api/trades?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.trades) {
            setTrades(data.trades);
            setPagination(data.pagination);
        } else {
            setTrades(Array.isArray(data) ? data : []);
        }
      })
      .catch(err => console.error('Trade fetch error:', err))
      .finally(() => setLoading(false));
  }, [pagination.page, sort.field, sort.order, filter.symbol, filter.status, filter.portfolioId, filter.startDate, filter.endDate]);

  // Main effect for filter/sort/pagination changes
  useEffect(() => {
    // We only skip if it's strictly a symbol change (handled by debounce below)
    // but React's state updates are batched, so we need careful logic.
    fetchTrades();
  }, [pagination.page, sort.field, sort.order, filter.status, filter.portfolioId, filter.startDate, filter.endDate, fetchTrades]);


  const handleSort = (field: string) => {
      setSort(prev => ({
          field,
          order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
      }));
  };

  if (loading && trades.length === 0) return <div className="text-white text-center py-8 animate-pulse font-mono text-sm">LOADING LEDGER...</div>;

  return (
    <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 shadow-xl">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
         <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                 <input 
                    type="text" 
                    placeholder="Search Symbol..."
                    className="bg-black border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-white/30 outline-none w-full md:w-48"
                    value={filter.symbol}
                    onChange={(e) => setFilter(prev => ({ ...prev, symbol: e.target.value }))}
                 />
             </div>
             <select 
                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-white/30 outline-none"
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
             >
                 <option value="">All Outcomes</option>
                 <option value="win">Winners</option>
                 <option value="loss">Losers</option>
             </select>
         </div>
         <div className="text-xs text-gray-500 font-mono uppercase">
             Showing {trades.length} of {pagination.total} Trades
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#0F0F0F] uppercase font-medium text-xs tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('timestampEntry')}>
                  <div className="flex items-center gap-1">Date <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-white group" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center gap-1">Symbol <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Side</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-white group" onClick={() => handleSort('pnl')}>
                  <div className="flex items-center justify-end gap-1">P&L <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trades.map((trade) => (
              <tr key={trade._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-mono text-xs">
                    {new Date(trade.timestampEntry).toLocaleDateString()}
                    <span className="block text-[10px] text-gray-600">
                        {new Date(trade.timestampEntry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </td>
                <td className="px-6 py-4 font-bold text-white tracking-wide">{trade.symbol}</td>
                <td className="px-6 py-4 hover:text-gray-300">{trade.assetType}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      trade.direction === 'long'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}
                  >
                    {trade.direction}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      {trade.rMultiple ? `${trade.rMultiple.toFixed(2)}R` : '-'}
                </td>
                <td
                  className={`px-6 py-4 text-right font-mono font-bold text-sm ${
                    (trade.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/journal/${trade._id}`}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline decoration-blue-400/30 underline-offset-4"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {trades.length === 0 && !loading && (
             <div className="p-12 text-center text-gray-600 font-mono text-sm border-t border-white/5">
                 NO ENCRYPTED LEDGER ENTRIES FOUND.
             </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-white/10 flex justify-between items-center bg-white/[0.02]">
           <button 
             disabled={pagination.page <= 1}
             onClick={() => setPagination((prev:any) => ({ ...prev, page: prev.page - 1 }))}
             className="px-4 py-2 bg-black border border-white/10 rounded-lg text-xs hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-black transition-colors flex items-center gap-2"
           >
              <ChevronLeft size={14} /> Previous
           </button>
           <span className="text-xs font-mono text-gray-500">
               Page {pagination.page} of {pagination.pages}
           </span>
           <button 
             disabled={pagination.page >= pagination.pages}
             onClick={() => setPagination((prev:any) => ({ ...prev, page: prev.page + 1 }))}
             className="px-4 py-2 bg-black border border-white/10 rounded-lg text-xs hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-black transition-colors flex items-center gap-2"
           >
              Next <ChevronRight size={14} />
           </button>
      </div>

    </div>
  );
}

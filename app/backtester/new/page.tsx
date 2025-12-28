
'use client';

import TradeForm from '@/components/TradeForm';

export default function NewBacktestTradePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-400 mb-4">
         <span className="text-xs font-mono uppercase px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Simulation Mode</span>
      </div>
      <h1 className="text-3xl font-bold text-white">Log Simulation Trade</h1>
      <TradeForm isBacktest={true} />
    </div>
  );
}

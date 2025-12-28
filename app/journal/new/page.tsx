
'use client';

import TradeForm from '@/components/TradeForm';

export default function NewTradePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Log New Trade</h1>
      <TradeForm />
    </div>
  );
}

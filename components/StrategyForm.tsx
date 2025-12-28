
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';

export default function StrategyForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: any) => {
    await fetch('/api/strategies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    reset();
    setIsOpen(false);
    onSuccess();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-bold transition-all text-sm"
      >
        <Plus size={16} />
        New Strategy
      </button>

    );
  }

  return (
    <div className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10 mb-6 relative animate-in fade-in zoom-in-95 duration-200">
      <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={20} />
      </button>
      <h3 className="text-xl font-bold mb-4 text-white">Define New Strategy</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Strategy Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
            placeholder="e.g. ICT Silver Bullet"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
            placeholder="Briefly describe the setup..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-bold transition-colors"
        >
          Create Strategy
        </button>
      </form>
    </div>

  );
}

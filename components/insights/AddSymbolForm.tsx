"use client";

import React, { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SymbolSearch from '@/components/SymbolSearch';
import { ChevronDown } from 'lucide-react';

interface AddSymbolFormProps {
  onAdd: (symbol: string, type: string) => Promise<void>;
}

export function AddSymbolForm({ onAdd }: AddSymbolFormProps) {
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('forex');
  const [loading, setLoading] = useState(false);

  // SymbolSearch handles the selection and asset type detection for us
  const handleSymbolSelect = (selectedSymbol: string, selectedAssetType: string) => {
    setSymbol(selectedSymbol);
    if (selectedAssetType) {
        setType(selectedAssetType);
    }
  };

  const handleManualAdd = async () => {
    if (!symbol) return;
    setLoading(true);
    try {
      await onAdd(symbol, type);
      setSymbol('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl mx-auto bg-zinc-900/80 p-2 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl relative z-20">
      <div className="flex-1">
        <SymbolSearch 
            value={symbol}
            assetType={type}
            onSymbolSelect={handleSymbolSelect}
            onAssetTypeChange={setType}
            placeholder="Search symbol (e.g. XAU/USD)..."
            className="w-full"
        />
      </div>
      


      <div className="flex items-center">
          <Button 
            onClick={handleManualAdd}
            disabled={loading || !symbol}
            className="h-16 w-16 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white p-0 shrink-0"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={32} />}
          </Button>
      </div>
    </div>
  );
}

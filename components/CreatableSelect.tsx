
'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface CreatableSelectProps {
    options: string[];
    selected: string | string[];
    onChange: (value: any) => void;
    placeholder?: string;
    multi?: boolean;
    onAdd?: (newVal: string) => void;
    onDelete?: (val: string) => void;
}

export default function CreatableSelect({ 
    options, 
    selected, 
    onChange, 
    placeholder = "Select...", 
    multi = false,
    onAdd,
    onDelete
}: CreatableSelectProps) {
    const [inputValue, setInputValue] = useState('');

    const isSelected = (val: string) => {
        if (multi) {
            return (selected as string[]).includes(val);
        }
        return selected === val;
    };

    const handleSelect = (val: string) => {
        if (multi) {
            const current = selected as string[];
            if (current.includes(val)) {
                onChange(current.filter(item => item !== val));
            } else {
                onChange([...current, val]);
            }
        } else {
            onChange(val);
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        if (onAdd) {
            onAdd(inputValue.trim());
        }
        handleSelect(inputValue.trim());
        setInputValue('');
    };

    const displayValue = multi 
        ? (selected as string[]).length > 0 
            ? `${(selected as string[]).length} selected` 
            : placeholder
        : (selected || placeholder);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-sm text-left hover:border-white/20 transition-all outline-none">
                    <span className={!selected || (multi && (selected as string[]).length === 0) ? 'text-gray-500' : 'text-white'}>
                        {displayValue}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-[#0F0F0F] border-white/10 text-white p-2 shadow-2xl z-[100]">
                <div className="max-h-60 overflow-y-auto scrollbar-hide space-y-1 mb-2">
                    {options.map((opt) => (
                        <div key={opt} className="flex items-center justify-between group">
                            <DropdownMenuItem 
                                className={`flex-1 flex items-center gap-2 rounded-md hover:bg-white/5 cursor-pointer ${isSelected(opt) ? 'bg-white/10' : ''}`}
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleSelect(opt);
                                }}
                            >
                                <div className={`w-3 h-3 rounded-full border border-white/20 flex items-center justify-center ${isSelected(opt) ? 'bg-white' : ''}`}>
                                    {isSelected(opt) && <Check size={8} className="text-black" />}
                                </div>
                                <span className="text-xs">{opt}</span>
                            </DropdownMenuItem>
                            {onDelete && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(opt);
                                    }}
                                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                <form onSubmit={handleAdd} className="border-t border-white/5 pt-2 flex gap-1">
                    <input 
                        className="flex-1 bg-black border border-white/10 rounded-md px-2 py-1 text-[10px] outline-none focus:border-white/30"
                        placeholder="Add custom..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="p-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                    >
                        <Plus size={12} />
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Check, Trash2, AlertTriangle } from 'lucide-react';
import CreatePortfolioModal from './CreatePortfolioModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Portfolio {
    _id: string;
    name: string;
}

interface PortfolioSelectorProps {
    currentId: string;
    onSelect: (id: string) => void;
}

import { usePortfolios } from '@/context/PortfolioContext';

export default function PortfolioSelector({ currentId, onSelect }: PortfolioSelectorProps) {
    const { portfolios, refreshPortfolios } = usePortfolios();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmText !== 'confirm' || !deleteId) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/portfolios/${deleteId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                if (currentId === deleteId) onSelect('all');
                await refreshPortfolios();
                setDeleteId(null);
                setConfirmText('');
            }
        } catch (err) {
            console.error('Failed to delete portfolio', err);
        } finally {
            setIsDeleting(false);
        }
    }

    const currentPortfolio = portfolios.find(p => p._id === currentId);
    const displayName = currentId === 'all' ? 'All Portfolios' : (currentPortfolio ? currentPortfolio.name : 'Loading...');

    return (
        <div className="relative z-50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] border border-white/10 rounded-lg text-sm hover:border-white/20 transition-all hover:bg-white/[0.02]"
            >
                <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] text-gray-500 uppercase font-mono leading-none">Portfolio</span>
                    <span className="font-medium max-w-[120px] truncate">{displayName}</span>
                </div>
                <ChevronDown size={14} className="text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 shadow-black/80 overflow-hidden ring-1 ring-white/5">
                    <div className="space-y-1 mb-2 max-h-64 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => {
                                onSelect('all');
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${currentId === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                        >
                            <span className="font-medium">All Portfolios</span>
                            {currentId === 'all' && <Check size={14} className="text-green-500" />}
                        </button>
                        <div className="h-px bg-white/5 my-1 mx-2" />
                        
                        {portfolios.map(p => (
                            <div key={p._id} className="group relative list-none">
                                <button
                                    onClick={() => {
                                        onSelect(p._id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${currentId === p._id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                                >
                                    <span className="truncate pr-10">{p.name}</span>
                                    {currentId === p._id && <Check size={14} className="text-green-500 mr-7" />}
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteId(p._id);
                                        setIsOpen(false);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-2 bg-gradient-to-b from-transparent to-white/[0.02]">
                        <button 
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-dashed border-white/10 hover:border-white/30"
                        >
                            <Plus size={14} />
                            CREATE NEW PORTFOLIO
                        </button>
                    </div>
                </div>
            )}

            <CreatePortfolioModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newPortfolio) => {
                    refreshPortfolios();
                    onSelect(newPortfolio._id);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle size={20} /> CAUTION: PERMANENT DELETION
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 pt-2 leading-relaxed">
                            Deleting this portfolio will <span className="text-white font-bold underline">permanently erase all associated trades</span>, journals, and analytical data. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <p className="text-xs text-gray-500 uppercase font-mono">Type <span className="text-white font-bold">confirm</span> below to proceed:</p>
                        <Input 
                            className="bg-black border-white/10 text-white focus:border-red-500/50 h-12"
                            placeholder="Type confirm..."
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button 
                            variant="ghost" 
                            className="flex-1 hover:bg-white/5 text-gray-400 hover:text-white"
                            onClick={() => setDeleteId(null)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={confirmText !== 'confirm' || isDeleting}
                            variant="destructive"
                            className="flex-[2] bg-red-600 hover:bg-red-700 font-bold"
                            onClick={handleDelete}
                        >
                            {isDeleting ? 'DELETING...' : 'DELETE PORTFOLIO'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

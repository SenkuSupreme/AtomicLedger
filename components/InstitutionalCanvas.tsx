
'use client';

import React, { useState, useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { 
    Maximize2, 
    RotateCw, 
    Trash2, 
    Image as ImageIcon, 
    Plus, 
    Layers, 
    MousePointer2,
    Move
} from 'lucide-react';

interface Element {
    id: string;
    type: 'image' | 'note';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
}

export default function InstitutionalCanvas({ elements, onElementsChange }: { elements: Element[], onElementsChange: (elements: Element[]) => void }) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const addImage = () => {
        const url = prompt("Enter Image URL (Working on better upload...)");
        if (!url) return;
        const newElement: Element = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            content: url,
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            rotation: 0,
            zIndex: elements.length + 1
        };
        onElementsChange([...elements, newElement]);
    };

    const updateElement = (id: string, updates: Partial<Element>) => {
        onElementsChange(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const deleteElement = (id: string) => {
        onElementsChange(elements.filter(el => el.id !== id));
        setSelectedId(null);
    };

    return (
        <div className="w-full h-[75vh] bg-[#030303] rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-inner">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Canvas Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl shadow-2xl">
                <button 
                    onClick={addImage}
                    className="p-3 hover:bg-white/[0.08] rounded-xl text-white/80 hover:text-sky-400 transition-all flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-white/10"
                >
                    <Plus size={18} /> Add Chart Asset
                </button>
                <div className="w-[1px] h-8 bg-white/10 mx-2" />
                <button className="p-3 text-white/80 hover:text-white transition-all hover:bg-white/5 rounded-xl"><MousePointer2 size={20} /></button>
                <button className="p-3 text-white/80 hover:text-white transition-all hover:bg-white/5 rounded-xl"><Layers size={20} /></button>
            </div>

            {/* Empty State Overlay */}
            {elements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 pointer-events-none">
                    <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                        <ImageIcon size={40} className="text-white/40" />
                    </div>
                    <div className="text-center">
                        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">Architectural Lab Offline</p>
                        <p className="text-[13px] text-white/70 max-w-sm text-center leading-relaxed">Synthesize your edge by arranging high-resolution trade setups on this institutional canvas.</p>
                    </div>
                </div>
            )}

            <div ref={canvasRef} className="absolute inset-0 overflow-auto cursor-crosshair scrollbar-hide">
                <div className="min-w-[3000px] min-h-[2000px] relative bg-transparent">
                    {elements.map((el) => (
                        <CanvasItem
                            key={el.id}
                            element={el}
                            isSelected={selectedId === el.id}
                            onSelect={() => setSelectedId(el.id)}
                            onUpdate={(updates: any) => updateElement(el.id, updates)}
                            onDelete={() => deleteElement(el.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Selection Controls Overlay (Bottom Right) */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="absolute bottom-10 right-10 flex items-center gap-6 bg-black/90 backdrop-blur-3xl border border-white/20 p-5 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50"
                    >
                        <div className="flex flex-col gap-1.5 pr-8 border-r border-white/10">
                            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none">Selected Asset</span>
                            <span className="text-[13px] font-black text-sky-400 uppercase tracking-widest">ID: {selectedId.slice(0,6)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => {
                                    const el = elements.find(e => e.id === selectedId);
                                    if (el) updateElement(selectedId, { rotation: el.rotation + 45 });
                                }}
                                className="p-3.5 hover:bg-white/[0.08] rounded-2xl text-white/80 hover:text-white transition-all border border-transparent hover:border-white/10"
                            >
                                <RotateCw size={20} />
                            </button>
                            <button 
                                onClick={() => deleteElement(selectedId)}
                                className="p-3.5 bg-rose-500/[0.08] rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sub-component for individual canvas items
function CanvasItem({ element, isSelected, onSelect, onUpdate, onDelete }: any) {
    const [isResizing, setIsResizing] = useState(false);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragStart={onSelect}
            onDrag={(e, info) => {
                onUpdate({ x: element.x + info.delta.x, y: element.y + info.delta.y });
            }}
            initial={{ x: element.x, y: element.y, rotate: element.rotation }}
            animate={{ 
                x: element.x, 
                y: element.y, 
                rotate: element.rotation, 
                width: element.width, 
                height: element.height,
                scale: isSelected ? 1.02 : 1,
                zIndex: isSelected ? 100 : element.zIndex
            }}
            style={{ position: 'absolute' }}
            className={`cursor-move rounded-[1.5rem] overflow-visible group/item transition-all duration-300 ${isSelected ? 'ring-4 ring-sky-500/50 shadow-[0_0_50px_rgba(14,165,233,0.3)]' : 'hover:ring-2 hover:ring-white/30'}`}
        >
            <div className="w-full h-full relative group">
                {element.type === 'image' ? (
                    <img 
                        src={element.content} 
                        className="w-full h-full object-cover rounded-[1.5rem] pointer-events-none bg-white/[0.02]" 
                        alt="Canvas Item"
                    />
                ) : (
                    <div className="w-full h-full bg-white/[0.05] backdrop-blur-3xl rounded-[1.5rem] p-8 border border-white/20 shadow-2xl">
                        <p className="text-white text-[15px] font-medium leading-relaxed">{element.content}</p>
                    </div>
                )}

                {/* Resizing Handler (Bottom Right) */}
                {isSelected && (
                    <div 
                        className="absolute bottom-[-12px] right-[-12px] w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center cursor-nwse-resize shadow-[0_0_20px_rgba(14,165,233,0.5)] z-[110] border-4 border-black group-hover:scale-110 transition-transform"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const startWidth = element.width;
                            const startHeight = element.height;

                            const onMouseMove = (moveEvent: MouseEvent) => {
                                onUpdate({ 
                                    width: Math.max(150, startWidth + (moveEvent.clientX - startX)),
                                    height: Math.max(100, startHeight + (moveEvent.clientY - startY))
                                });
                            };

                            const onMouseUp = () => {
                                window.removeEventListener('mousemove', onMouseMove);
                                window.removeEventListener('mouseup', onMouseUp);
                            };

                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                        }}
                    >
                        <Maximize2 size={12} className="text-white" strokeWidth={3} />
                    </div>
                )}

                {/* Info Chip on hover */}
                {!isSelected && (
                    <div className="absolute top-5 left-5 px-4 py-2 bg-black/80 backdrop-blur-2xl rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2.5">
                             <Move size={12} className="text-sky-400" /> {Math.round(element.width)} <span className="text-white/40">×</span> {Math.round(element.height)}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

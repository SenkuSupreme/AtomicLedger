
'use client';

import { motion } from 'framer-motion';

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">
                {title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 === 1 ? 'text-gray-500' : ''}>{word} </span>
                ))}
            </h1>
            <p className="text-gray-400 max-w-md leading-relaxed font-medium">
                {description}
            </p>
            <div className="mt-12 flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                <div className="h-px w-8 bg-white/5" />
                Under Development
                <div className="h-px w-8 bg-white/5" />
            </div>
        </div>
    );
}

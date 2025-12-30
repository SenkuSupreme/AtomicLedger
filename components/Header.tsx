
'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search, User, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Clock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
    const formattedTime = currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });

    return (
        <div className="hidden xl:flex items-center gap-6 px-5 py-2 bg-white/[0.03] border border-white/10 rounded-2xl">
            <div className="flex flex-col items-start border-r border-white/10 pr-6">
                <span className="text-[10px] text-white/60 font-black uppercase leading-none mb-1.5 tracking-widest">Time</span>
                <span className="text-[11px] text-white/80 font-black uppercase tracking-wider">{currentTime.getHours() % 12 || 12}:{currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes()} {currentTime.getHours() >= 12 ? 'PM' : 'AM'}</span>
            </div>
            <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/60 font-black uppercase leading-none mb-1.5 tracking-widest">Date</span>
                <span className="text-[11px] text-white/80 font-black uppercase tracking-wider">{formattedDate}</span>
            </div>
        </div>
    );
}

import React from 'react';

const Header = React.memo(function Header() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New York Session', message: 'The New York session has officially started.', time: 'Just now', type: 'info' },
        { id: 2, title: 'Daily Goal', message: 'You have reached 80% of your daily profit goal.', time: '2h ago', type: 'success' }
    ]);

    return (
        <header className="sticky top-0 z-[40] w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl focus-within:bg-white/[0.06] transition-all">
                        <Search size={14} className="text-white/60" />
                        <input 
                            type="text" 
                            placeholder="Search signals, trades..." 
                            className="bg-transparent border-none outline-none text-[13px] text-white/95 w-56 placeholder:text-white/60"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Live Clock & Date */}
                    <Clock />

                    

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-black" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 bg-[#0A0A0A] border border-white/10 text-white p-2 shadow-2xl rounded-2xl">
                            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-white/60 py-4 px-3">Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {notifications.map(n => (
                                <DropdownMenuItem key={n.id} className="focus:bg-white/5 rounded-xl p-4 cursor-pointer mb-1 group transition-all">
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-bold flex items-center gap-2 text-white/80 group-hover:text-white">
                                            <Zap size={14} className="text-yellow-400" /> {n.title}
                                        </p>
                                        <p className="text-xs text-white/70 leading-relaxed group-hover:text-white/60">{n.message}</p>
                                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{n.time}</p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-black text-white leading-none mb-1.5">{session?.user?.name}</p>
                            <p className="text-[10px] text-white/60 font-black uppercase leading-none tracking-[0.1em]">Gold Trader</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/20 flex items-center justify-center text-sm font-bold shadow-lg shadow-black/40">
                            {session?.user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
});

export default Header;


import React, { useState, useEffect } from 'react';


// Session definitions relative to a 24h cycle starting at 03:45 NPT (Sydney Open)
// All offsets and durations in minutes
const CYCLE_START_TIME = { hour: 3, minute: 45 }; // 03:45 AM
const TOTAL_MINUTES = 24 * 60;

const SESSIONS = [
  { 
    id: 'sydney', 
    name: 'Sydney', 
    startOffset: 0, 
    duration: 540, 
    color: 'bg-blue-500', 
    localLabel: '03:45 - 12:45',
    details: 'Lower volatility. Good for AUD, NZD pairs. Market liquidity forms.'
  },
  { 
    id: 'tokyo', 
    name: 'Tokyo', 
    startOffset: 120, 
    duration: 540, 
    color: 'bg-indigo-500', 
    localLabel: '05:45 - 14:45',
    details: 'Moderate volatility. Best pairs: JPY (USDJPY, EURJPY). Range-bound unless news.'
  },
  { 
    id: 'london', 
    name: 'London', 
    startOffset: 600, 
    duration: 540, 
    color: 'bg-orange-500', 
    localLabel: '13:45 - 22:45',
    details: 'Highest liquidity. Strong directional moves. Best: EURUSD, GBPUSD, XAUUSD.'
  },
  { 
    id: 'newyork', 
    name: 'New York', 
    startOffset: 900, 
    duration: 540, 
    color: 'bg-emerald-500', 
    localLabel: '18:45 - 03:45',
    details: 'High volatility. USD pairs dominate. Major US economic news releases.'
  },
];

const ForexSessionNavbar = React.memo(function ForexSessionNavbar() {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('');
  const [activeSessions, setActiveSessions] = useState<string[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const nptOffset = 5.75 * 60 * 60 * 1000; // +5:45
      const nptDate = new Date(utcTime + nptOffset);

      const currentHours = nptDate.getHours();
      const currentMinutes = nptDate.getMinutes();
      const currentTotalMins = currentHours * 60 + currentMinutes;

      // Calculate progress relative to 03:45 AM
      const startMins = CYCLE_START_TIME.hour * 60 + CYCLE_START_TIME.minute;
      let diffMins = currentTotalMins - startMins;
      if (diffMins < 0) diffMins += TOTAL_MINUTES;

      const progress = (diffMins / TOTAL_MINUTES) * 100;
      setCurrentProgress(progress);
      
      const hours = nptDate.getHours();
      const minutes = nptDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      
      setCurrentTimeFormatted(`${displayHours}:${displayMinutes} ${ampm}`);

      // Determine active sessions
      const active = SESSIONS.filter(session => {
          return diffMins >= session.startOffset && diffMins < (session.startOffset + session.duration);
      }).map(s => s.id);
      
      setActiveSessions(active);
    };

    updateTime();
    // Update every 10 seconds for performance
    const interval = setInterval(updateTime, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] rounded-xl border border-white/10 p-6 mb-8">
        <div className="max-w-7xl mx-auto">
            {/* Header / Info */}
            <div className="flex justify-between items-end mb-8">
                <div>
                     <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Market Sessions (NPT)</h2>
                     <div className="text-3xl font-bold text-white font-mono mt-1">{currentTimeFormatted}</div>
                </div>
                <div className="flex gap-4 text-xs font-mono text-white/40">
                    {SESSIONS.map(s => (
                        <div key={s.id} className={`flex items-center gap-1.5 ${activeSessions.includes(s.id) ? 'text-white' : 'opacity-40'}`}>
                            <div className={`w-2 h-2 rounded-full ${s.color}`} />
                            {s.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Container */}
            <div className="relative h-32 w-full pt-6">
                <div className="absolute top-0 left-0 w-full h-full border-t border-b border-white/5" />

                {/* Session Bars */}
                <div className="absolute top-4 left-0 w-full h-full">
                    {SESSIONS.map((session, index) => {
                         const left = (session.startOffset / TOTAL_MINUTES) * 100;
                         const width = (session.duration / TOTAL_MINUTES) * 100;
                         const top = index * 24; 

                         return (
                             <div 
                                key={session.id}
                                className="absolute h-4 rounded-full flex items-center px-2 border border-white/5 transition-opacity group cursor-help"
                                style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    top: `${top}px`,
                                    backgroundColor: activeSessions.includes(session.id) ? 'rgb(255 255 255 / 0.1)' : 'rgb(255 255 255 / 0.03)',
                                    borderColor: activeSessions.includes(session.id) ? 'rgb(255 255 255 / 0.2)' : 'transparent' 
                                }}
                             >
                                 <span className={`text-[10px] uppercase font-bold tracking-wider mr-2 ${session.color.replace('bg-', 'text-')}`}>
                                    {session.name}
                                 </span>
                                 <span className="text-[9px] text-white/40 font-mono hidden md:inline ml-auto">
                                    {session.localLabel}
                                 </span>

                                 <div className="absolute top-6 left-0 z-50 hidden group-hover:block w-48 p-2 bg-[#111] border border-white/10 rounded-lg shadow-xl">
                                     <p className="text-[10px] text-white/80 leading-relaxed">{session.details}</p>
                                 </div>
                             </div>
                         );
                    })}
                </div>

                {/* Current Time Line */}
                <div 
                    className="absolute top-[-10px] bottom-[-10px] w-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-20 pointer-events-none transition-all duration-1000 ease-linear"
                    style={{ left: `${currentProgress}%` }}
                >
                    <div className="absolute -top-1 -left-[4px] w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <div className="absolute -bottom-1 -left-[4px] w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
            </div>
        </div>
    </div>
  );
});

export default ForexSessionNavbar;

'use client';

import React, { useEffect, useRef, memo } from 'react';
import { Calendar, Globe } from 'lucide-react';

function EconomicCalendarWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''; // Nuke existing widget to force re-render
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "colorTheme": "dark",
        "isTransparent": false, // Disable transparency to force native dark theme assets
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "importanceFilter": "-1,0,1",
        "currencyFilter": "USD,EUR,GBP,JPY,AUD,CAD,CHF,NZD"
      });
      
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden relative group">
       {/* Header */}
       <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-md relative z-10">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Macro Data</span>
             </div>
             <h3 className="text-lg font-black text-foreground italic tracking-tighter uppercase opacity-100">Economic Calendar</h3>
          </div>
          <div className="p-2 bg-foreground/5 rounded-xl border border-border text-emerald-500">
             <Calendar size={16} />
          </div>
       </div>

       {/* Widget Container */}
       <div className="flex-1 overflow-hidden relative bg-black">
          <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
             <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
          </div>
          {/* Custom Overlay to mask TradingView branding if needed, or just add atmosphere */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
       </div>
    </div>
  );
}

export default memo(EconomicCalendarWidget);

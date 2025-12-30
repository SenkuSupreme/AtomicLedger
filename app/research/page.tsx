"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  LayoutGrid,
  TrendingUp,
  FileText,
  Activity,
  Globe,
  Plus,
  Microscope,
  Zap,
  Info,
  BarChart3,
  RefreshCw,
  Maximize2,
  X,
  ChevronRight
} from "lucide-react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const COMMON_TICKERS = [
  // Forex
  { symbol: "FX:EURUSD", name: "EUR / USD", category: "Forex" },
  { symbol: "FX:GBPUSD", name: "GBP / USD", category: "Forex" },
  { symbol: "FX:USDJPY", name: "USD / JPY", category: "Forex" },
  { symbol: "FX:AUDUSD", name: "AUD / USD", category: "Forex" },
  { symbol: "FX:USDCAD", name: "USD / CAD", category: "Forex" },
  { symbol: "FX:EURJPY", name: "EUR / JPY", category: "Forex" },
  // Gold & Commodities
  { symbol: "OANDA:XAUUSD", name: "Gold Spot", category: "Commodities" },
  { symbol: "OANDA:XAGUSD", name: "Silver Spot", category: "Commodities" },
  { symbol: "TVC:USOIL", name: "Crude Oil WTI", category: "Commodities" },
  { symbol: "TVC:UKOIL", name: "Brent Crude Oil", category: "Commodities" },
  { symbol: "TVC:GOLD", name: "Gold Futures", category: "Futures" },
  // Futures & Indices
  { symbol: "CME:ES1!", name: "E-mini S&P 500", category: "Futures" },
  { symbol: "CME:NQ1!", name: "E-mini Nasdaq 100", category: "Futures" },
  { symbol: "FOREXCOM:SPX500", name: "S&P 500 Index", category: "Indices" },
  { symbol: "FOREXCOM:NSXUSD", name: "Nasdaq 100", category: "Indices" },
  { symbol: "FOREXCOM:DJI", name: "Dow Jones 30", category: "Indices" },
  { symbol: "FOREXCOM:UK100", name: "FTSE 100", category: "Indices" },
  // Crypto
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum", category: "Crypto" },
  { symbol: "BINANCE:SOLUSDT", name: "Solana", category: "Crypto" },
  { symbol: "BINANCE:XRPUSDT", name: "XRP", category: "Crypto" },
  { symbol: "BINANCE:ADAUSDT", name: "Cardano", category: "Crypto" },
  // Stocks
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", category: "Stocks" },
  { symbol: "NASDAQ:TSLA", name: "Tesla, Inc.", category: "Stocks" },
  { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp.", category: "Stocks" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", category: "Stocks" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", category: "Stocks" },
  { symbol: "NASDAQ:META", name: "Meta Platforms", category: "Stocks" },
  { symbol: "NYSE:BRK.B", name: "Berkshire Hathaway", category: "Stocks" },
];

export default function ResearchPage() {
  const [symbol, setSymbol] = useState("NASDAQ:AAPL");
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      renderWidgets();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.TradingView) {
      renderWidgets();
    }
  }, [symbol]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderWidgets = () => {
    setIsLoading(true);
    
    renderTickerTape();
    renderSymbolInfo();
    renderCompanyProfile();
    renderFundamentalData();
    renderTechnicalAnalysis();
    renderTimeline();

    setTimeout(() => setIsLoading(false), 800);
  };

  const renderTickerTape = () => {
    const container = document.getElementById("tv-ticker-tape");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });
    container.appendChild(script);
  };

  const renderSymbolInfo = () => {
    const container = document.getElementById("tv-symbol-info");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "width": "100%",
      "locale": "en",
      "colorTheme": "dark",
      "isTransparent": true
    });
    container.appendChild(script);
  };

  const renderCompanyProfile = () => {
    const container = document.getElementById("tv-company-profile");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "100%",
      "colorTheme": "dark",
      "isTransparent": true,
      "symbol": symbol,
      "locale": "en"
    });
    container.appendChild(script);
  };

  const renderFundamentalData = () => {
    const container = document.getElementById("tv-fundamental-data");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "largeChartUrl": "",
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "symbol": symbol,
      "locale": "en"
    });
    container.appendChild(script);
  };

  const renderTechnicalAnalysis = () => {
    const container = document.getElementById("tv-technical-analysis");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": symbol,
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
    });
    container.appendChild(script);
  };

  const renderTimeline = () => {
    const container = document.getElementById("tv-timeline");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "symbol",
      "symbol": symbol,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "locale": "en"
    });
    container.appendChild(script);
  };

  const filteredTickers = COMMON_TICKERS.filter(t => 
    t.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
    t.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    t.category.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectSymbol = (newSym: string) => {
    setSymbol(newSym);
    setSearchInput("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* GLOBAL TICKER TAPE */}
      <div id="tv-ticker-tape" className="h-[46px] border-b border-white/5 bg-white/[0.02] flex-shrink-0" />

      {/* SEARCH & HUD BAR */}
      <div className="flex items-center justify-between px-8 py-5 bg-[#0A0A0A] border-b border-white/5 relative z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Microscope size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">Intelligence Hub</h1>
              <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest">Global Asset Analysis Protocol</p>
            </div>
          </div>

          <div className="relative w-96" ref={dropdownRef}>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search Institutional Node... (e.g. BTC, AAPL)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold uppercase tracking-wider outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
            {isDropdownOpen && searchInput.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-80 overflow-y-auto no-scrollbar">
                  {filteredTickers.length > 0 ? (
                    filteredTickers.map((t) => (
                      <button
                        key={t.symbol}
                        onClick={() => handleSelectSymbol(t.symbol)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group border-b border-white/[0.02] last:border-0"
                      >
                        <div className="flex items-center gap-3 text-left">
                           <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center font-black text-[10px] text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                              {t.symbol.split(":")[1]?.slice(0, 2)}
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-widest">{t.symbol}</p>
                             <p className="text-[9px] text-white/30 font-bold group-hover:text-white/60 transition-colors">{t.name}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black uppercase py-1 px-2 rounded bg-white/5 text-white/40 border border-white/10 group-hover:border-blue-500/30 group-hover:text-blue-400">{t.category}</span>
                           <ChevronRight size={14} className="text-white/10 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                       <Zap size={24} className="text-white/10 mx-auto mb-2" />
                       <p className="text-[10px] uppercase font-black tracking-widest text-white/20">No matching nodes found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl">
              <Activity size={14} className="text-green-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Selected: {symbol}</span>
           </div>
        </div>
      </div>

      {/* TERMINAL VIEWPORT */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none no-scrollbar bg-[#050505]">
        <div className="max-w-[1700px] mx-auto space-y-8 relative">
          
          {isLoading && (
            <div className="absolute inset-x-0 -top-8 bottom-0 z-[60] flex flex-col items-center pt-32 bg-[#050505]/60 backdrop-blur-sm pointer-events-none">
                <Zap className="text-blue-500 animate-bounce mb-4" size={48} />
                <div className="text-[11px] font-black text-blue-400 uppercase tracking-[0.8em] animate-pulse">Synchronizing Intelligence Mesh...</div>
            </div>
          )}

          {/* TOP ROW: SYMBOL INFO - WIDER PANEL */}
          <section className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 px-4">
                 <Activity size={16} /> Asset Identification Node
               </h3>
               <div id="tv-symbol-info" className="h-44 rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl transition-all" />
          </section>

          {/* SECOND ROW: PROFILE & FUNDAMENTALS (REPLACES CHART AREA) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
            <div className="flex flex-col h-full space-y-4 group">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 px-4 group-hover:text-white/40 transition-all">
                 <Info size={16} /> Entity Infrastructure
               </h3>
               <div id="tv-company-profile" className="flex-1 rounded-[2.5rem] bg-white/[0.02] border border-white/10 p-6 overflow-hidden hover:bg-white/[0.04] transition-all shadow-xl" />
            </div>
            <div className="flex flex-col h-full space-y-4 group">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 px-4 group-hover:text-white/40 transition-all">
                 <BarChart3 size={16} /> Fundamental Ledger Analysis
               </h3>
               <div id="tv-fundamental-data" className="flex-1 rounded-[2.5rem] bg-white/[0.02] border border-white/10 p-6 overflow-hidden hover:bg-white/[0.04] transition-all shadow-xl" />
            </div>
          </div>

          {/* THIRD ROW: TECHNICAL & NEWS - TAKES MORE SPACE NOW */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-[600px] pb-12">
             <div className="lg:col-span-2 flex flex-col h-full space-y-4 group">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 px-4 group-hover:text-white/40 transition-all">
                  <Activity size={16} /> Sentiment Oscillator Grid
                </h3>
                <div id="tv-technical-analysis" className="flex-1 rounded-[2.5rem] bg-white/[0.02] border border-white/10 p-6 overflow-hidden hover:bg-white/[0.04] transition-all shadow-xl" />
             </div>
             <div className="lg:col-span-3 flex flex-col h-full space-y-4 group">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 px-2 group-hover:text-white/40 transition-all font-bold">
                  <Globe size={16} /> Global Communication Timeline
                </h3>
                <div id="tv-timeline" className="flex-1 rounded-[2.5rem] bg-white/[0.02] border border-white/10 p-6 overflow-hidden hover:bg-white/[0.04] transition-all shadow-xl" />
             </div>
          </div>

        </div>
      </main>

      {/* TERMINAL FOOTER */}
      <footer className="h-12 border-t border-white/5 bg-black flex items-center justify-between px-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Protocol: Intelligence v5.2.0</span>
           </div>
           <span>Mesh: Secure Terminal Node Active</span>
        </div>
        <div className="flex items-center gap-4 italic opacity-80 font-bold border-l border-white/10 pl-8">
           INTELLIGENCE SOURCE: TRADINGVIEW DATA MESH
        </div>
      </footer>
    </div>
  );
}

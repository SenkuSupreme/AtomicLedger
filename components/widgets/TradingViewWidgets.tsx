"use client";

import React, { useEffect, useRef } from "react";

import { useTheme } from "next-themes";

const TVWidget = ({ scriptSrc, config, id }: { scriptSrc: string, config: any, id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    // Nuke existing widget to force re-render and prevent ghosting
    containerRef.current.innerHTML = "";
    
    // Create the script element
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    
    // Merge theme and transparency into the config
    // Forcing 'dark' for institutional aesthetic with absolute black background
    const finalConfig = {
      ...config,
      colorTheme: "dark",
      isTransparent: false, // Critical: Must be false to trigger native dark assets
      backgroundColor: "#000000",
      container_id: id,
      width: "100%",
      height: "100%",
      locale: "en",
      autosize: true
    };

    script.innerHTML = JSON.stringify(finalConfig);
    containerRef.current.appendChild(script);
  }, [config, scriptSrc, id, mounted]);

  if (!mounted) return <div className="w-full h-full bg-black/20 animate-pulse rounded-2xl" id={id} />;

  return (
    <div 
      id={id} 
      ref={containerRef} 
      className="w-full h-full bg-black overflow-hidden rounded-xl" 
      style={{ colorScheme: 'dark' }}
    />
  );
};

export const TVTechnicalAnalysisWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-ta-widget"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
    config={{
      "interval": "1h",
      "width": "100%",
      "isTransparent": false,
      "height": "100%",
      "symbol": symbol,
      "showIntervalTabs": true,
      "locale": "en"
    }}
  />
);

export const TVForexHeatMapWidget = () => (
  <TVWidget 
    id="tv-heatmap-widget"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js"
    config={{
      "width": "100%",
      "height": "100%",
      "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
      "isTransparent": false,
      "locale": "en"
    }}
  />
);

export const TVMarketQuotesWidget = () => (
  <TVWidget 
    id="tv-quotes-widget"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
    config={{
      "width": "100%",
      "height": "100%",
      "symbolsGroups": [
        {
          "name": "Forex",
          "originalName": "Forex",
          "symbols": [
            { "name": "FX:EURUSD" },
            { "name": "FX:GBPUSD" },
            { "name": "FX:USDJPY" },
            { "name": "FX:AUDUSD" },
            { "name": "FX:USDCAD" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": false,
      "locale": "en"
    }}
  />
);

export const TVTickerTapeWidget = () => (
  <TVWidget 
    id="tv-ticker-tape-dashboard"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
    config={{
      "symbols": [
        { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" }
      ],
      "showSymbolLogo": true,
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "en"
    }}
  />
);

export const TVSymbolInfoWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-symbol-info"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
    config={{
      "symbol": symbol,
      "width": "100%",
      "locale": "en",
      "isTransparent": false,
    }}
  />
);

export const TVCompanyProfileWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-company-profile"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
    config={{
      "width": "100%",
      "height": "100%",
      "showSymbolLogo": true,
      "symbol": symbol,
      "isTransparent": false,
      "locale": "en"
    }}
  />
);

export const TVFundamentalDataWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-fundamental-data"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
    config={{
      "showSymbolLogo": true,
      "largeChartUrl": "",
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "symbol": symbol,
      "isTransparent": false,
      "locale": "en"
    }}
  />
);

export const TVTimelineWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-timeline"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
    config={{
      "feedMode": "symbol",
      "symbol": symbol,
      "showSymbolLogo": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "isTransparent": false,
      "locale": "en"
    }}
  />
);

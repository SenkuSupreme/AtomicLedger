"use client";

import React, { useEffect, useRef } from "react";

const TVWidget = ({ scriptSrc, config, id }: { scriptSrc: string, config: any, id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
  }, [config, scriptSrc]);

  return <div id={id} ref={containerRef} className="w-full h-full min-h-[200px]" />;
};

export const TVTechnicalAnalysisWidget = ({ symbol = "FX:EURUSD" }) => (
  <TVWidget 
    id="tv-ta-widget"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
    config={{
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": symbol,
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
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
      "isTransparent": true,
      "colorTheme": "dark",
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
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en"
    }}
  />
);

export const TVEconomicCalendarWidget = () => (
  <TVWidget 
    id="tv-economic-calendar"
    scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
    config={{
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "importanceFilter": "-1,0,1"
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
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    }}
  />
);

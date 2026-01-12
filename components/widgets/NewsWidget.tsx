"use client";

import React, { useState, useEffect } from "react";
import { Newspaper, ExternalLink, RefreshCw, Radio } from "lucide-react";
import Link from "next/link";

interface NewsWidgetProps {
  className?: string;
}

export default function NewsWidget({ className = "" }: NewsWidgetProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news?category=forex");
      const data = await res.json();
      if (data.articles) {
        setNews(data.articles.slice(0, 10)); // Top 10
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="relative flex items-center justify-center w-3 h-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Live Feed</span>
          </div>
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Market Intel</h3>
        </div>
        <button 
          onClick={fetchNews}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="h-[300px] space-y-3 overflow-y-auto pr-2 custom-scrollbar relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
             <Radio size={32} className="text-white/20 animate-pulse" />
             <p className="text-xs font-mono text-white/40 uppercase tracking-widest animate-pulse">Scanning frequencies...</p>
          </div>
        ) : news.length > 0 ? (
          news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative pl-4 border-l border-white/10 hover:border-white/40 transition-all duration-300"
            >
              <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between gap-3">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getImpactColor(item.impact)}`}>
                         {item.impact || 'NEWS'}
                       </span>
                       <span className="text-[10px] font-mono text-white/40">
                         {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <h4 className="text-xs font-bold text-white/90 group-hover:text-blue-400 transition-colors leading-relaxed line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono">
                      // {item.source?.name}
                    </p>
                 </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-12">
            <Radio size={24} className="text-white/20 mx-auto mb-3" />
            <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
              Signal Lost
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5">
        <Link
          href="/news"
          className="flex items-center justify-between group"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
             <Newspaper size={12} />
             <span>Full Wire</span>
          </div>
          <ExternalLink size={12} className="text-white/20 group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
